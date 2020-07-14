/* eslint-disable @typescript-eslint/no-unused-vars, prefer-arrow/prefer-arrow-functions */
import models from '../models';
import pdf2HtmlQueue from '../queues/pdf2htmlQueue';

import express from 'express';
import multer from 'multer';

import { promises as fs } from 'fs';
import path from 'path';

const router = express.Router(),
  // setup multer
  storage = multer.diskStorage({
    destination(req, file, _cb) {
      _cb(null, './public/uploads');
    },
    filename(req, file, _cb) {
      const uniquePrefix = `${+new Date()}-${Math.round(Math.random() * 1e9)}`;
      _cb(null, `${uniquePrefix}_${file.originalname}`);
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

router.get('/', async (req, res, _next) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  const conversions = await models.Pdf2HtmlConversion.findAll();
  res.json(conversions);
});

router.post('/', upload, async (req, res, _next) => {
  if (!req.file) {
    res.send({
      status: false,
      message: 'No file uploaded',
    });
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _data = { ...req.body, filePath: req.file.path },
    conversion = await models.Pdf2HtmlConversion.create(_data);
  res.json(conversion);
});

router['delete']('/:id', async (req, res, _next) => {
  const { id } = req.params,
    conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    }),
    conversion = conversions[0];
  try {
    // eslint-disable-next-line
    await fs.unlink(`${__dirname}/../${conversion.filePath}`);
    if (conversion.convertedFilePath) {
      await fs.unlink(`${__dirname}/../files/${conversion.convertedFilePath}`);
    }
    // eslint-disable-next-line no-empty
  } catch (error) {
  } finally {
    await conversion.destroy();
    res.json({});
  }
});

router.put('/cancel/:id', async (req, res, _next) => {
  const { id } = req.params,
    conversion = await models.Pdf2HtmlConversion.update(
      { status: 'cancelled' },
      {
        where: { id },
      },
    );
  res.json(conversion);
});

router.get('/start/:id', async (req, res, _next) => {
  const { id } = req.params,
    conversions = await models.Pdf2HtmlConversion.findAll({
      where: { id },
    }),
    conversion = conversions[0],
    filePath = path.basename(conversion.filePath);
  await pdf2HtmlQueue.add({ id, path: filePath });
  res.json({});
});

export = router;
