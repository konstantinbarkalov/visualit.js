'use strict';
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'static')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(`Serverside error: ${err.message}`);
  console.warn(`Serverside error sended to client: ${err.message}`);
});

module.exports = app;
