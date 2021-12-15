'use strict';

async function processRemote(path, content) {
    const axios = require('axios');
    const replaceHandlebarPattern = /\{\{[^\}]+\}\}/;
    let replace = '';

    try {
        const response = await axios.get(path);
        replace = response.data;
    } catch {
        replace = '<!-- remote include path "' + path + '" could not be processed -->';
    }

    return content.replace(replaceHandlebarPattern, replace);
}

async function process(req, content) {
    const handlebarPattern = /(?<={{ )(.+)(?= }})/g; // match: {{ * }}
    const foundHandlebars = content.match(handlebarPattern);

    if (foundHandlebars && foundHandlebars.length) {
        const protocol = req.protocol + '://';
        const host = req.hostname;
        const port = ':3000';
        const includePattern = /(?<=includeRemote[(]\')(.+)(?=\'[)])/g; // match: includeRemote('*')

        for (const index in foundHandlebars) { // loop through occurances of: {{ * }}
            const foundInclude = foundHandlebars[index].match(includePattern);

            if (foundInclude) {
                const path = foundInclude[0];
                const remotePath = protocol + host + port + path;
                content = await processRemote(remotePath, content);
            }
        }
    }

    return content;
}

module.exports = {
    process: process
};
