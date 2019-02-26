const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

/*
 * Garage page
 */
router.get('/', function (req, res, next) {
	fs.readFile(path.resolve(__dirname, '../../../frontend/build_garage/index.html'), 'utf-8', (err, str) => {
		if (err) { return next(err); }

    res.send(str);
	});
});

module.exports = router;
