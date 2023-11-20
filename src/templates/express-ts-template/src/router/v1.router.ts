import express from 'express';

const app = express();

import testRouter from './test.router.js';
app.use('/test', testRouter);


export default app;