import express from 'express';

import { deleteTestController, getTestController, postTestController, putTestController, } from '../controller/test.controller.js';

const app = express();


app.get('/', getTestController)
app.put('/', putTestController)
app.post('/', postTestController)
app.delete('/', deleteTestController)


export default app;