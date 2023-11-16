const express = require('express');
const { getTestController, putTestController, postTestController, deleteTestController } = require('../controller/test.controller');
const app = express();

app.get('/', getTestController)
app.put('/', putTestController)
app.post('/', postTestController)
app.delete('/', deleteTestController)

module.exports = app;