'use strict';

const fs = require('fs');
const appConfig = require('../app.json');

const cacheStorage = appConfig.cacheStorage;

function getFileCacheKey(key) {
    const crypto = require('crypto');
    const cacheKey = crypto.createHash('md5').update(key).digest('hex');

    return cacheKey;
}

function getCacheKey(key) {
    let cacheKey;

    switch(cacheStorage.type) {
        case 'file':
            cacheKey = getFileCacheKey(key);
            break;
        case 'db':
            break;
        case 'default':
            break;
    }

    return cacheKey;
}

function getFileCachedValue(cacheKey) {
    const cacheFilePath = cacheStorage.loc + cacheKey;
    let cachedValue;

    if (fs.existsSync(cacheFilePath)) {
        cachedValue = fs.readFileSync(cacheFilePath, 'utf8');
    }

    return cachedValue;
}

function getCachedValue(cacheKey) {
    let cachedValue;

    switch(cacheStorage.type) {
        case 'file':
            cachedValue = getFileCachedValue(cacheKey);
            break;
        case 'db':
            break;
        case 'default':
            break;
    }

    return cachedValue;
}

function setFileCachedValue(cacheKey, value) {
    const cacheFilePath = cacheStorage.loc + cacheKey;

    fs.writeFile(cacheFilePath, value, function(err) {
        if (err) throw err;
    });
}

function setCachedValue(cacheKey, value) {
    let cachedValue;

    switch(cacheStorage.type) {
        case 'file':
            cachedValue = setFileCachedValue(cacheKey, value);
            break;
        case 'db':
            break;
        case 'default':
            break;
    }

    return cachedValue;
}

function deleteFileCachedValue(cacheKey) {
    const cacheFilePath = cacheStorage.loc + cacheKey;

    if (fs.existsSync(cacheFilePath)) {
        fs.unlink(cacheFilePath, function(err) {
            if (err) throw err;
        });
    }
}

function deleteCachedValue(cacheKey) {
    let cachedValue;

    switch(cacheStorage.type) {
        case 'file':
            cachedValue = deleteFileCachedValue(cacheKey);
            break;
        case 'db':
            break;
        case 'default':
            break;
    }

    return cachedValue;
}

module.exports = {
    getCacheKey,
    getCachedValue,
    setCachedValue,
    deleteCachedValue
};