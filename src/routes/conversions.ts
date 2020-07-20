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

import express from 'express';
import createError from 'http-errors';
import multer from 'multer';

import fs from 'fs';
import path from 'path';

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

router.post('/conversion', upload, async (req, res, _next) => {
  if (!req.file) {
    res.send({
      status: false,
      message: 'No file uploaded',
    });
  }
  const splitPage = req.body['split_pages'],
    _data = {
      ...req.body,
      originFileName: req.file.originalname,
      filePath: req.file.path,
      splitPage: !(splitPage !== undefined && (splitPage === '0' || splitPage === 'false')),
    },
    conversion = await models.Pdf2HtmlConversion.create(_data);
  res.json(conversion);
});

router.get('/conversion/:id', async (req, res, next) => {
  const { id } = req.params,
    conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    });
  if (conversions.length === 0) {
    next(createError(404, 'Task is not exist'));
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
    next(createError(404, 'Task is not exist.'));
    return;
  }
  const conversion = conversions[0];
  if (conversion.status === 'converting') {
    next(createError(404, 'Task is converting, unable be deleted. Please try later.'));
    return;
  }
  try {
    console.log(`${conversion.filePath}`);
    await fs.promises.unlink(`${conversion.filePath}`);
    if (conversion.convertedFilePath) {
      await fs.promises.unlink(`${conversion.convertedFilePath}`);
    }
  } catch (error) {
    next(createError(500, 'Deleting Failed.'));
    return;
  }
  await conversion.destroy();
  res.json({});
});

router.put('/conversion/:id/cancel', async (req, res, _next) => {
  const { id } = req.params,
    conversion = await models.Pdf2HtmlConversion.update(
      { status: 'cancelled' },
      {
        where: { id, status: 'pending' },
      },
    );
  res.json(conversion);
});

router.get('/conversion/:id/start', async (req, res, next) => {
  const { id } = req.params,
    conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    });
  if (conversions.length === 0) {
    next(createError(404, 'Task is not exist'));
    return;
  }
  const conversion = conversions[0];
  if (conversion.status !== 'pending') {
    next(createError(404, "It's not a valid task (pending) to start!")); // eslint-disable-line
    return;
  }
  try {
    await pdf2HtmlQueue.add({
      id,
      path: `./${conversion.filePath}`,
      options: {
        '--split-pages': conversion.splitPage,
      },
    });
  } catch (error) {
    next(createError(500, 'Failed to add the task of transcoding pdf to html.'));
  }
  res.json({});
});

export = router;
