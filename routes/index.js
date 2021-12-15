const express = require('express');
const router = express.Router();
const cache = require('./middleware/cache');

router.get('/', cache.applyDefault, function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
