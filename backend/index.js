const path = require('path');
const express = require('express');
const app = express();

require('dotenv').config();
const publicDir = path.join(__dirname, process.env.STATIC_PATH);
const templatesPath = path.join(__dirname, process.env.TEMPLATES_PATH);

/**
 * View engine setup
 */
app.set('views', templatesPath);
app.set('view engine', 'twig');

/**
 * Yard
 */
const index = require('./routes/yard');

app.use('/', index);

/**
 * Serve static files
 */
app.use(express.static(publicDir));

/**
 * Start server
 */
app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server running at ${process.env.HOST}:${process.env.PORT}/`);
});
