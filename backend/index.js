const path = require('path');
const env = require('dotenv').config({ path: path.resolve(__dirname, '.env') }).parsed;

const express = require('express');
const app = express();

app.use('/', express.static(path.join(__dirname, '../frontend/dist/')));

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server running at ${env.HOST}:${env.PORT}/`);
});
