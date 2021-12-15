const express = require('express');
const router = express.Router();
const cache = require('./middleware/cache');

router.get('/', cache.applyDefault, function(req, res, next) {
    res.render('partial', { title: 'Uncached Remote Include' });
});

router.get('/me', cache.applyDefault, function(req, res, next) {
    res.render('partial', { title: 'Cached Remote Include' });
});

module.exports = router;
