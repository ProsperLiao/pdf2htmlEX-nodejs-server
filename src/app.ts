import bodyParser from 'body-parser';
import express from 'express';
import { NextFunction, Request, Response } from 'express'

import  systemConfig from './config';

const app = express();

// 处理 post 请求的请求体
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.sendStatus(500);
});

app.get('/', function(res, rep) {
    rep.send('Hello, world!');
});

app.listen(systemConfig.port, () => {
    console.log(`the server is start  at port ${systemConfig.port}`);
});

export default app;
