/**
 * 利用metalsmith移动到项目文件夹
 */

let Metalsmith = require('metalsmith'),
    path = require('path'),
    exists = require('fs').existsSync;

module.exports = function (tplPath, to) {

    checkPathFn(tplPath);
    checkPathFn(path.resolve(tplPath, 'render.js'));

    let metalsmith = new Metalsmith(tplPath),
        endCb = () => {};
        
    let _this = {
        init: function (cb = () => {}) {
            cb(metalsmith);
            return _this;
        },
        directory: function (npath) {
            metalsmith.directory(npath);
            return _this;
        },
        use: function (plugin) {
            metalsmith.use(plugin);
            return _this;
        },
        start: function () {
            setTimeout(() => {
                metalsmith
                    .clean(false)
                    .source('.')
                    .destination(to)
                    .build((err, files) => {
                        if (err) {
                            throw err;
                        }
                        endCb(files);
                    });
            }, 0);
            return _this;
        },
        end: function (cb = () => {}) {
            endCb = cb;
            return _this;
        }
    };
    return _this;
};

function checkPathFn (checkPath) {    
    if (!exists(checkPath)) {
        throw new Error(`createFiles.js - Error: Not exist ${checkPath}`);
    }
}

