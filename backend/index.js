const path = require('path');
const env = require('dotenv').config({ path: path.resolve(__dirname, '.env') }).parsed;
const fs = require('fs');
const express = require('express');
const app = express();

const publicDir = path.join(__dirname, '../frontend/dist/');

app.use(function (req, res, next) {
  if (req.path !== '/' && req.path.indexOf('.') === -1) {
    req.url += '.html';
  }
  next();
});

app.use('/', express.static(publicDir));

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server running at ${env.HOST}:${env.PORT}/`);
});
