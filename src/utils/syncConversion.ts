/* eslint-disable @typescript-eslint/dot-notation */
import models from '../models';

import { Response } from 'express';

const syncConversionMap: Map<number, Response> = new Map<number, Response>();

/**
 * @param id
 * @param zipFilePath
 */
export async function responseToSyncConversion(id: number, zipFilePath?: string) {
  const res = syncConversionMap.get(id);
  if (zipFilePath) {
    const conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    });
    if (conversions.length === 0) {
      res?.status(500).send('Internal Error!');
      return;
    }
    const conversion = conversions[0];
    res?.json(conversion);
  } else {
    res?.status(500).send('Internal Error!');
  }
  syncConversionMap.delete(id);
}

/**
 * @param id
 * @param res
 */
export function addToSyncConversion(id: number, res: Response) {
  syncConversionMap.set(id, res);
}

/**
 * @param id
 */
export function removeFromSyncConversion(id: number) {
  syncConversionMap.delete(id);
}
