import express from 'express';
import v1Router from './v1.router.js'

const app = express();


app.use('/v1', v1Router);

export default app;