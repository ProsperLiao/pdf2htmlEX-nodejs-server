import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { NextFunction, Request, Response } from "express";

import systemConfig from "./config";

// setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./tmp/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = path
      .basename(file.originalname)
      .slice(0, -path.extname(file.originalname).length);
    cb(null, `${filename}_${uniqueSuffix}.pdf`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Set the filetypes, it is optional
    const filetypes = /pdf/;
    const mimetype = filetypes.test(file.mimetype);

    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      `Error: File upload only supports the following filetypes - ${filetypes}`
    );
  },
}).single("uploaded_file");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("output"));
app.use(cors());
// 处理 post 请求的请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.sendStatus(500);
});

app.get("/", function (req: Request, res: Response) {
  res.render("index");
});

app.post("/html2pdf", upload, async (req: any, res: Response) => {
  //
  // res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  // res.setHeader("Cache-Control", "no-cache, must-revalidate");
  console.log(req.file, req.body);

  try {
    if (!req.file) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      //send response
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: req.file.name,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

let port = process.env.PORT || systemConfig.port;
app.listen(port, () => {
  console.log(`the server is start  at port ${port}`);
});

export default app;

// I'm just browsing this repo but wanted to comment that you can use any CLI tool from Node with the built-in child_process module. This is an important thing to know doing Node development.
//
// quick demo:
//
//     const { exec, /* or spawn */ } = require('child_process')
// exec('pdf2htmlEX [options] <input-filename> [<output-filename>]', callback)
// Longer explanations:
//     https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
//         https://nodejs.org/api/child_process.html
