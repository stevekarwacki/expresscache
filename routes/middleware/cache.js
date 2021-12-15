'use strict';

const Cache = require('../../models/cache');

function writeCache(res) {
    // after request sends
    res.on('finish', function() {
        if (res.locals.body && res.locals.cacheKey) {
            let timestamp = new Date();
            // cache the page
            Cache.setCachedValue(res.locals.cacheKey, res.locals.body + "\n" + '<!-- cached on ' + timestamp + ' -->' + "\n");
            // Cache.setCachedValue(res.locals.cacheKey, res.locals.body);
        }
    });
}

async function defaultCache(req, res, next) {
    const key = req.originalUrl || '/';
    const cacheKey = Cache.getCacheKey(key);
    const content = Cache.getCachedValue(cacheKey);

    // if page already cached
    if (content) {
        const remoteInclude = require('../../helpers/include');
        const processedContent = await remoteInclude.process(req, content);
        // return cached page
        res.send(processedContent);
        res.end();
    } else {
        res.locals.cacheKey = cacheKey;
        writeCache(res);
        next();
    }
}

module.exports = {
    applyDefault: defaultCache
};
