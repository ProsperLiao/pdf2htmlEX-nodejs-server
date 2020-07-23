/* eslint-disable
    @typescript-eslint/no-unused-vars,
    @typescript-eslint/naming-convention,
    @typescript-eslint/no-unsafe-call,
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-member-access,
    prefer-arrow/prefer-arrow-functions
 */
import models from '../models';
import pdf2HtmlQueue from '../queues/pdf2htmlQueue';
import { addToSyncConversion, removeFromSyncConversion } from '../utils/syncConversion';

import express, { NextFunction, Response } from 'express';
import createError from 'http-errors';
import multer from 'multer';

import fs from 'fs';
import path from 'path';

const syncConversion = async (conversion: any, res: Response, next: NextFunction) => {
  const { id } = conversion;
  try {
    await models.Pdf2HtmlConversion.update(
      { status: 'pending' },
      {
        where: { id },
      },
    );
    addToSyncConversion(id, res);
    await pdf2HtmlQueue.add({
      id,
      path: conversion.filePath,
      options: {
        '--split-pages': conversion.splitPages,
      },
    });
  } catch (error) {
    removeFromSyncConversion(id);
    next(createError(500, 'Failed to add the task of transcoding pdf to html.'));
  }
};

// eslint-disable-next-line one-var
const router = express.Router(),
  // setup multer
  storage = multer.diskStorage({
    destination(req, file, _cb) {
      const dir = `./public/pdf2html/${new Date().toISOString()}_${Math.round(Math.random() * 1e9)}`;
      fs.mkdir(dir, error => {
        _cb(error, dir);
      });
    },
    filename(req, file, _cb) {
      _cb(null, `${file.originalname}`);
    },
  }),
  upload = multer({
    storage,
    fileFilter(req, file, _cb) {
      // Set the filetypes, it is optional
      const filetypes = /pdf/,
        mimetype = filetypes.test(file.mimetype),
        extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return _cb(null, true);
      }
      return _cb(new Error(`Error: File upload only supports the following filetypes - ${filetypes.toString()}`));
    },
  }).single('uploaded_file');

router.get('/conversion', async (req, res, _next) => {
  // eslint-disable-next-line
  const conversions = await models.Pdf2HtmlConversion.findAll();
  res.json(conversions);
});

router.post('/conversion', upload, async (req, res, next) => {
  if (!req.file) {
    res.send({
      status: false,
      message: 'No file uploaded',
    });
  }
  const splitPages = req.body['split_pages'],
    _data = {
      ...req.body,
      originFileName: req.file.originalname,
      filePath: `./${req.file.path}`,
      splitPages: !(splitPages !== undefined && (splitPages === '0' || splitPages === 'false')),
    },
    conversion = await models.Pdf2HtmlConversion.create(_data),
    { active, waiting } = await pdf2HtmlQueue.getJobCounts();
  if (req.file.size < 2 * 1024 * 1024 && active === 0 && waiting === 0) {
    // convert in sync mode
    await syncConversion(conversion, res, next);
  } else {
    res.status(201).json({
      message: 'Upload Successfully!',
      task: conversion,
      href: {
        start: `/api/conversion/${conversion.id}/start`,
        checkStatus: `/api/conversion/${conversion.id}`,
      },
    });
  }
});

router.get('/conversion/:id', async (req, res, next) => {
  const { id } = req.params,
    conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    });
  if (conversions.length === 0) {
    next(createError(400, 'Task is not exist'));
    return;
  }
  const conversion = conversions[0];
  res.json(conversion);
});

router['delete']('/conversion/:id', async (req, res, next) => {
  const { id } = req.params,
    conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    });
  if (conversions.length === 0) {
    next(createError(400, 'Task is not exist.'));
    return;
  }
  const conversion = conversions[0];
  if (conversion.status === 'converting') {
    next(createError(400, 'Task is converting, unable be deleted. Please try later.'));
    return;
  }
  try {
    await fs.promises.rmdir(`${path.dirname(conversion.filePath)}`, { recursive: true });
    // if (conversion.convertedFilePath) {
    //   await fs.promises.unlink(`${conversion.convertedFilePath}`);
    // }
  } catch (error) {
    next(createError(500, 'Deleting Failed.'));
    return;
  }
  await conversion.destroy();
  res.json({
    message: 'Delete Successfully!',
    task: conversion,
  });
});

router.put('/conversion/:id/cancel', async (req, res, _next) => {
  const { id } = req.params,
    conversion = await models.Pdf2HtmlConversion.update(
      { status: 'cancelled' },
      {
        where: { id, status: 'pending' },
      },
    ),
    count = conversion[0];

  if (count === 0) {
    res.status(400).send(`Fail to cancel. There is no pending task for this id ${id}.`);
  } else {
    res.json({
      message: 'Cancel Successfully!',
      task: conversion,
      href: {
        checkStatus: `/api/conversion/${conversion.id}`,
      },
    });
  }
});

router.get('/conversion/:id/start', async (req, res, next) => {
  const { id } = req.params,
    conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    });
  if (conversions.length === 0) {
    next(createError(400, 'Task is not exist'));
    return;
  }
  const conversion = conversions[0];
  if (conversion.status !== 'uploaded' && conversion.status !== 'cancelled') {
    next(createError(400, "It's not a valid task (uploaded or cancelled) to start!")); // eslint-disable-line
    return;
  }
  try {
    await models.Pdf2HtmlConversion.update(
      { status: 'pending' },
      {
        where: { id },
      },
    );
    await pdf2HtmlQueue.add({
      id,
      path: conversion.filePath,
      options: {
        '--split-pages': conversion.splitPages,
      },
    });
  } catch (error) {
    next(createError(500, 'Failed to add the task of transcoding pdf to html.'));
  }
  res.status(202).json({
    message: 'Start Successfully!',
    task: conversion,
    id,
    href: {
      checkStatus: `/api/conversion/${conversion.id}`,
    },
  });
});

router.get('/conversion/:id/download', async (req, res, next) => {
  const { id } = req.params,
    conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    });
  if (conversions.length === 0) {
    next(createError(400, 'Task is not exist'));
    return;
  }
  const conversion = conversions[0];
  if (conversion.status !== 'done') {
    next(createError(400, "It's not done yet!")); // eslint-disable-line
    return;
  }
  res.download(conversion.zipFilePath);
});

export = router;
