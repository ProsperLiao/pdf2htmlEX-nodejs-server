/* eslint-disable
    id-blacklist,
    @typescript-eslint/no-unused-vars,
    @typescript-eslint/no-floating-promises,
    consistent-return,
    @typescript-eslint/dot-notation
*/
import models from '../models';
import { Pdf2HtmlEx, AdditionalOptions, Pdf2HtmlProgressObj } from '../pdf2htmljs/pdf2html';

import Queue from 'bull';

import * as console from 'console';
import pathLib from 'path';

const pdf2HtmlQueue = new Queue('pdf2html transcoding'),
  convertPdf2Html = (
    src: string,
    options: AdditionalOptions,
    progressHandler: (progress: Pdf2HtmlProgressObj) => void,
  ) => {
    const fileName = src.replace(/\.[^/.]+$/, ''),
      basename = pathLib.basename(fileName),
      dir = fileName.slice(0, -basename.length),
      dest = `${dir}${basename}.html`;

    return new Promise((resolve: (value?: { convertedFilePath: string }) => void, reject) => {
      const pdf2HtmlEx = new Pdf2HtmlEx(src, dest, options);
      pdf2HtmlEx.progress(progressHandler);
      pdf2HtmlEx
        .convert()
        .then(ret => {
          console.log(ret);
          resolve({ convertedFilePath: dest });
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    });
  };

pdf2HtmlQueue.process(async job => {
  const { id, path, options } = job.data;
  try {
    const conversions = await models.Pdf2HtmlConversion.findAll({
        where: { id },
      }),
      conv = conversions[0];
    if (conv.status === 'cancelled' || conv.status === 'done') {
      return Promise.resolve();
    }
    const start = Date.now();
    await models.Pdf2HtmlConversion.update(
      { status: 'converting' },
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
      pathObj = await convertPdf2Html(path, options, progressHandler),
      duration = (Date.now() - start) / 1000,
      { convertedFilePath } = pathObj,
      conversion = await models.Pdf2HtmlConversion.update(
        { convertedFilePath, status: 'done', convertDuration: duration },
        {
          where: { id },
        },
      );
    await conversion;
  } catch (error) {
    await Promise.reject(error);
  }
});

export = pdf2HtmlQueue;
