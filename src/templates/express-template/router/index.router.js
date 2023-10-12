const express = require('express');
const app = express();

app.use('/v1', require('./v1.router'));

module.exports = app;