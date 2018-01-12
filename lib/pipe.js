
/**
 * @param data 存储数据到this
 * @returns oproxy {{proxy对象}}
 */
var pipe = function ({fnObj = {}, _this = {}, data = {}} = {}) {
    let that = JSON.parse(JSON.stringify(_this));
    data = JSON.parse(JSON.stringify(data));
    that = _this = merge2this(_this, data);
    let funcStack = [],
        errHandle = () => {
        },
        end = () => {
        },
        res = {};

    that.next = _this.next = next;
    _this = getProxyFn(_this);
    function next (err) {
        if (err) {
            return errHandle.call(_this, err, _this);
        }
        let fn = funcStack.shift();
        if (typeof fn !== 'function') {
            return end.call(_this, _this);
        }
        let fnType = getType(fn).toLowerCase();
        if (fnType === 'asyncfunction' || fnType === 'promise') {
            return fn.call(_this, _this).catch((e) => {
                errHandle.call(_this, e, _this);
            });
        }
        try {
            fn.call(_this, _this);
        } catch (e) {
            errHandle.call(_this, e, _this);
        }
    }
    let oproxy = new Proxy({}, {
        get: function (pipeObject, fnName) {
            // console.log(fnName);
            if (fnName === 'setData') {
                return function (data) {
                    let next = that.next;
                    that = merge2this(that, data);
                    that.next = next;
                    _this = getProxyFn(that);
                    return oproxy;
                };
            }
            if (fnName === 'start') {
                return function () {
                    setTimeout(() => {
                        next();
                    }, 0);
                    return oproxy;
                };
            }
            if (fnName === 'end') {
                return function (cb) {
                    end = (cb || (() => {
                    })).bind(_this);
                    return oproxy;
                };
            }
            if (fnName === 'catch') {
                return function (cb) {
                    errHandle = (cb || (() => {
                    })).bind(_this);
                    return oproxy;
                };
            }
            if (fnName === 'next') {
                return function (cb) {
                    funcStack.push(cb || (() => {
                    }));
                    return oproxy;
                };
            }
            funcStack.push(fnObj[fnName]);

            return function () {
                return oproxy;
            };
        }
    });

    function getProxyFn(target) {
        let proxy = new Proxy(target, {
            get: getFn,
            set: setFn
        });
        return proxy;
    }

    function getFn(target, propName) {
        if (getType(target[propName]) === 'array' && target[propName].length < 1) {
            return target[propName];
        }
        if (getType(target[propName]) === 'object') {
            return new Proxy(target[propName], {
                get: getFn,
                set: setFn
            })
        }
        if (getType(target[propName]) === 'undefined') {
            console.error(`get ${propName} not in this! please define in data`);
        }
        return target[propName];
    }

    function setFn(target, key, val) {
        if (getType(target[key]) === 'undefined') {
            console.error(`set ${key} not in this! please define in data`);
            return true;
        }
        target[key] = val;
        return true;
    }

    function merge2this(_this = {}, source) {
        Object.keys(source).forEach((key) => {
            if (getType(_this[key]) !== 'undefined') {
                throw new Error(`Duplicate ${key} in this`);
            }
            _this[key] = source[key];
        });
        return JSON.parse(JSON.stringify(_this));
    }

    function getType(val) {
        if (val && val.toString && val.toString().slice(1, 7).toLowerCase() === 'object') {
            return val.toString().slice(8, -1).toLowerCase();
        }
        return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
    }

    return oproxy;
};

/**
 * 把data里面的数据判断是否在this中已经存在了，是报错，否深复制到this
 */
// pipe({
//     data: {
//         ctx: 'asd',
//         test: {
//             dd: 123,
//             ff: 333
//         }
//     }
// }).next((_this) => {
//     _this.test.dd = 666;
//     console.log(1);
//     _this.next();
// }).next(function () {
//     console.log(this.test.dd);
//     this.next();
// }).start().end(() => {
//     console.log('end');
// }).catch((e) => {
//     console.log(e);
// });

module.exports = pipe;

/**
 *
 */

