'use strict'

const remoteInclude = require('./include');

function interceptRender() {
    return function (req, res, next) {
        res.render = function (view, options, callback) {
            var self = this;
            options = options || res.locals;

            self.app.render(view, options, async function (err, content) {
                if (!callback) {
                    self.locals.body = content; // set cache without rendered remote include
                    const processedContent = await remoteInclude.process(req, content);
                    self.send(processedContent);
                } else {
                    callback();
                }
            });
        }

        next();
    }
}

module.exports = {
    interceptRender: interceptRender
};
