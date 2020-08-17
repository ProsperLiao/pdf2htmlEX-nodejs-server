/* eslint-disable
    import/prefer-default-export,
    @typescript-eslint/explicit-module-boundary-types,
    prefer-arrow/prefer-arrow-functions,
    jsdoc/require-param,
    jsdoc/require-jsdoc,
    @typescript-eslint/no-misused-promises,
    no-await-in-loop,
    no-restricted-syntax,
    no-restricted-syntax
 */
import models from '../models';

import fs from 'fs';
import path from 'path';

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024,
    dm = decimals < 0 ? 0 : decimals,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

// clean the tasks the exceeds two days
export async function cleanTasks() {
  const conversions = await models.Pdf2HtmlConversion.findAll();
  for (const c of conversions) {
    const diff = new Date().getTime() - new Date(c.createdAt).getTime();
    if (diff > 2 * 24 * 60 * 60 * 1000) {
      try {
        await fs.promises.rmdir(`${path.dirname(c.filePath)}`, { recursive: true });
      } catch (error) {
        console.log(error);
      }
      await c.destroy();
    }
  }

  const dir = path.resolve(__dirname, '../public/pdf2html');
  // Loop through all the files in the public/pdf2html directory
  fs.readdir(dir, async (_err, files) => {
    if (_err) {
      console.error('Could not list the directory.', _err);
    }
    for (const file of files) {
      // Make one pass and make the file complete
      const components = file.split('_'),
        createdAt = new Date(components[0]),
        diffTime = new Date().getTime() - new Date(createdAt).getTime(),
        filePath = path.join(dir, file);
      if (diffTime > 2 * 24 * 60 * 60 * 1000) {
        try {
          await fs.promises.rmdir(`${filePath}`, { recursive: true });
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
}

export const transformPath = (conversion: { filePath?: string; convertedFilePath?: string; zipFilePath?: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...conversion,
    filePath: conversion.filePath?.replace(path.resolve(__dirname, '../public'), ''),
    convertedFilePath: conversion.convertedFilePath?.replace(path.resolve(__dirname, '../public'), ''),
    zipFilePath: conversion.zipFilePath?.replace(path.resolve(__dirname, '../public'), ''),
  };
};
