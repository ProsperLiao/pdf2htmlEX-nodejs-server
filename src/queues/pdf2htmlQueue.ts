import models from '../models';

import Queue from 'bull';
// import fs from 'fs';
// var ffmpeg = require("fluent-ffmpeg");

const pdf2HtmlQueue = new Queue('pdf2html transcoding'),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  convertPdf2Html = (path: string, _options: any) => {
    const fileName = path.replace(/\.[^/.]+$/, ''),
      convertedFilePath = `${fileName}_${+new Date()}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve: (value?: { convertedFilePath: string }) => void, _reject) => {
      // ffmpeg(`${__dirname}/../files/${path}`)
      //   .setFfmpegPath(process.env.FFMPEG_PATH)
      //   .setFfprobePath(process.env.FFPROBE_PATH)
      //   .toFormat(format)
      //   .on("start", (commandLine) => {
      //     console.log(`Spawned Ffmpeg with command: ${commandLine}`);
      //   })
      //   .on("error", (err, stdout, stderr) => {
      //     console.log(err, stdout, stderr);
      //     reject(err);
      //   })
      //   .on("end", (stdout, stderr) => {
      //     console.log(stdout, stderr);
      //     resolve({ convertedFilePath });
      //   })
      //   .saveToFile(`${__dirname}/../files/${convertedFilePath}`);
      setTimeout(() => {
        resolve({ convertedFilePath });
      }, 3000);
    });
  };

// eslint-disable-next-line @typescript-eslint/no-floating-promises,consistent-return
pdf2HtmlQueue.process(async job => {
  const { id, path, options } = job.data;
  try {
    const conversions = await models.Pdf2HtmlConversion.findAll({
        where: { id },
      }),
      conv = conversions[0];
    if (conv.status === 'cancelled') {
      return Promise.resolve();
    }
    const pathObj = await convertPdf2Html(path, options),
      { convertedFilePath } = pathObj,
      conversion = await models.Pdf2HtmlConversion.update(
        { convertedFilePath, status: 'done' },
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
