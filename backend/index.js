const path = require('path');
const express = require('express');
const app = express();

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const publicDir = path.resolve(__dirname, '../frontend');
const templatesPath = path.resolve(__dirname, '../frontend/yard/views');

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
 * Garage
 */
app.use('/garage', express.static(path.resolve(__dirname, '../frontend/garage/views')));

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
