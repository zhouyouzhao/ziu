/**
 * 利用metalsmith移动到项目文件夹
 */

let Metalsmith = require('metalsmith'),
    path = require('path'),
    exists = require('fs').existsSync;

module.exports = function (tplPath, to) {
    console.log(tplPath, to);

    checkPathFn(tplPath);
    checkPathFn(path.resolve(tplPath, 'render.js'));

    let metalsmith = new Metalsmith(tplPath);

    let _this = {
        init: function (cb = () => {}) {
            cb(metalsmith);
            return _this;
        },
        source: function (npath) {
            metalsmith = new Metalsmith(npath);
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
                    .destination(to);
            }, 0);
            return _this;
        },
        end: function (cb = () => {}) {
            metalsmith.build((err, files) => {
                if (err) {
                    throw err;
                }
                cb(files);
            });
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

