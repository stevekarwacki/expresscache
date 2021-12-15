const express = require('express');
const router = express.Router();

router.get('/delete', function(req, res, next) {
    const Cache = require('../models/cache');
    const deleteUrl = '/';
    const cacheKey = Cache.getCacheKey(deleteUrl);

    Cache.deleteCachedValue(cacheKey);

	res.redirect(deleteUrl);
});

router.get('/delete/:deleteUrl', function(req, res, next) {
    const Cache = require('../models/cache');
    const deleteUrl = '/' + req.params.deleteUrl;
    const cacheKey = Cache.getCacheKey(deleteUrl);

    Cache.deleteCachedValue(cacheKey);

	res.redirect(deleteUrl);
});

module.exports = router;
