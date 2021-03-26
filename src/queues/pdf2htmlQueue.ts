/* eslint-disable
    @typescript-eslint/no-unused-vars,
    @typescript-eslint/no-floating-promises,
    consistent-return,
    @typescript-eslint/dot-notation
*/
import models from '../models';
import { Pdf2HtmlEx, AdditionalOptions, Pdf2HtmlProgressObj } from '../pdf2htmljs/pdf2html';
import { responseToSyncConversion } from '../utils';

import archiver from 'archiver';
import Queue from 'bull';

import * as console from 'console';
import fs from 'fs';
import pathLib from 'path';

const convertorMap: Map<number, Pdf2HtmlEx> = new Map<number, Pdf2HtmlEx>(),
  pdf2HtmlQueue = new Queue('pdf2html transcoding', {
    redis: { port: parseInt(process.env.REDIS_PORT || '6379'), host: process.env.REDIS_CONNECTION },
  }),
  convertPdf2Html = (
    src: string,
    options: AdditionalOptions,
    progressHandler: (progress: Pdf2HtmlProgressObj) => void,
  ) => {
    const fileName = src.replace(/\.[^/.]+$/, ''),
      basename = pathLib.basename(fileName),
      dir = fileName.slice(0, -basename.length),
      dest = `${dir}${basename}`,
      pdf2HtmlEx = new Pdf2HtmlEx(src, dest, options);

    return {
      convertor: pdf2HtmlEx,
      result: new Promise((resolve: (value?: { dest: string }) => void, reject) => {
        pdf2HtmlEx.progress(progressHandler);
        pdf2HtmlEx
          .convert()
          .then(ret => {
            console.log(ret);
            resolve({ dest });
          })
          .catch(e => {
            console.log(e);
            reject(e);
          });
      }),
    };
  },
  zip = async (convertedPath: string, splitPages: boolean) => {
    const output = fs.createWriteStream(`${convertedPath}.zip`),
      archive = archiver('zip');
    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });
    archive.on('error', err => {
      throw err;
    });
    archive.pipe(output);
    if (splitPages) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      fs.readdir(convertedPath, async (err, files) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        files.forEach(file => {
          archive.file(`${convertedPath}/${file}`, { name: file });
        });
        await archive.finalize();
      });
    } else {
      archive.file(`${convertedPath}.html`, { name: `${pathLib.basename(convertedPath)}.html` });
      await archive.finalize();
    }

    return `${convertedPath}.zip`;
  };

pdf2HtmlQueue.process(async job => {
  const { id, path, options } = job.data;
  try {
    const conversions = await models.Pdf2HtmlConversion.findAll({
        where: { id },
      }),
      conv = conversions[0];
    if (
      conv.status === 'cancelled' ||
      conv.status === 'done' ||
      conv.status === 'converting' ||
      conv.status === 'zipping'
    ) {
      return Promise.resolve();
    }
    const start = Date.now();
    await models.Pdf2HtmlConversion.update(
      { status: 'converting', job_id: job.id },
      {
        where: { id, status: 'pending' },
      },
    );
    const progressHandler = (progress: Pdf2HtmlProgressObj) => {
        models.Pdf2HtmlConversion.update(
          { current: progress.current, total: progress.total },
          {
            where: { id },
          },
        );
      },
      { convertor, result } = convertPdf2Html(path, options, progressHandler);
    if (typeof job.id === 'string') {
      convertorMap.set(parseInt(job.id), convertor);
    } else {
      convertorMap.set(job.id, convertor);
    }

    const pathObj = await result;
    await models.Pdf2HtmlConversion.update(
      { status: 'zipping' },
      {
        where: { id },
      },
    );
    const { dest } = pathObj,
      originFileName = conv.originFileName.replace(/\.[^/.]+$/, ''),
      convertedFilePath = `${dest}${conv.splitPages ? `/${originFileName}.html` : '.html'}`;

    // 写入 scorm.xml
    if (conv.splitPages) {
      const content = `<?xml version='1.0' encoding='utf-8'?>
<scorm baseurl=''>
  <title>${originFileName}</title>
  <item id='1' type='text/html' href='index.html' title='' />
</scorm>
`;

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      fs.writeFile(`${dest}/scorm.xml`, content, async err => {
        if (err) throw err;
        fs.renameSync(convertedFilePath, `${dest}/index.html`);
        const zipFilePath = await zip(dest, options['--split-pages']),
          duration = (Date.now() - start) / 1000,
          conversion = await models.Pdf2HtmlConversion.update(
            { convertedFilePath: `${dest}/index.html`, status: 'done', convertDuration: duration, zipFilePath },
            {
              where: { id },
            },
          );
        await responseToSyncConversion(id, zipFilePath);
        await conversion;
      });
    } else {
      const zipFilePath = await zip(dest, options['--split-pages']),
        duration = (Date.now() - start) / 1000,
        conversion = await models.Pdf2HtmlConversion.update(
          { convertedFilePath, status: 'done', convertDuration: duration, zipFilePath },
          {
            where: { id },
          },
        );
      await responseToSyncConversion(id, zipFilePath);
      await conversion;
    }
  } catch (error) {
    await responseToSyncConversion(id);
    await Promise.reject(error);
  }
});

const startConversion = async (conversion: any) => {
    await models.Pdf2HtmlConversion.update(
      { status: 'pending' },
      {
        where: { id: conversion.id },
      },
    );
    await pdf2HtmlQueue.add({
      id: conversion.id,
      path: conversion.filePath,
      options: {
        '--split-pages': conversion.splitPages,
      },
      originFileSize: conversion.originFileSize,
    });
  },
  cancelJob = async (jobId: number) => {
    const job = await pdf2HtmlQueue.getJob(jobId);
    await job?.releaseLock();
    await job?.remove();
    const convertor = convertorMap.get(jobId);
    convertor?.cancel();
    convertorMap.delete(jobId);
  },
  resumeConvertingJobs = async () => {
    const isReady = await pdf2HtmlQueue.isReady();
    if (isReady) {
      const conversions = await models.Pdf2HtmlConversion.findAll({
        where: { status: 'converting' },
      });
      await Promise.all(
        conversions.map(async (conversion: any) => {
          await startConversion(conversion);
        }),
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(resumeConvertingJobs, 1000);
    }
  };

export { startConversion, cancelJob, resumeConvertingJobs, pdf2HtmlQueue };
