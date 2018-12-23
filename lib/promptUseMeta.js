/**
 * 下载模板后，引导用户配置package.json等项目配置信息
 */

let inquirer = require('inquirer'),
    path = require('path'),
    validateName = require('validate-npm-package-name'),
    metaName = 'meta.js',
    gitUser = require('./author.js'),
    pipe = require('./pipe.js');

let promptType = {
    string: 'input'
};

let installPrompt = {
    type: 'list',
    message: 'Should we run `npm install` or `npm install --registry=https://registry.npm.taobao.org` ?',
    choices: [
        {
            name: 'npm install',
            value: 'npm',
            short: 'npm',
        },
        {
            name: 'npm install --registry=https://registry.npm.taobao.org',
            value: 'cnpm',
            short: 'registry',
        },
    ],
};

module.exports = function (src, fileName, cb = () => {}) {
    let metsOpts = require(path.resolve(__dirname, src, metaName)),
        prompts = metsOpts.prompts;

    if (!metsOpts.closeInstall) {
        prompts.commanderType = installPrompt;
    }
    /**
     * 设置package.json中name默认值
     */
    setDefault(metsOpts, 'name', fileName);
    /**
     * 设置package.json中author默认值
     */
    setDefault(metsOpts, 'author', gitUser.name + gitUser.email);
    /**
     * prompt人机交互
     */
    asyncFn({
        prompts,
        end: (data) => {
            data.closeInstall = metsOpts.closeInstall;
            cb(data);
        }
    });
};

function asyncFn ({pipeOpts = {}, prompts = {}, end = () => {}} = {}) {

    let pipeObj = pipe(pipeOpts),
        answersObj = {};
    Object.keys(prompts).forEach((name, ind) => {
        pipeObj.setData({
            [name]: ''
        });
        pipeObj.next(function () {
            let prompt = prompts[name];
            /**
             * 设置validate函数
             */
            checkPackageName(prompt, name);
            if (prompt.when && !answersObj[prompt.when]) {
                answersObj[name] = false;
                return this.next();
            }

            inquirer
                .prompt({
                    type: promptType[prompt.type] || prompt.type,
                    name,
                    message: prompt.message,
                    default: prompt.default,
                    choices: prompt.choices || [],
                    validate: prompt.validate || function (answers) {
                        return true;
                    }
                })
                .then((answers) => {
                    if (Array.isArray(answers[name])) {
                        pipeObj.answersObj[name] = {};
                        answers[name].forEach((answer) => {
                            answersObj[name][answer] = true;
                        });
                    } else if (typeof answers[name] === 'string') {
                        answersObj[name] = answers[name].replace(/"/g, '\\"');
                    } else {
                        answersObj[name] = answers[name];
                    }
                    this.next();
                });
        });
    });
    return pipeObj.start().end(function () {
        end(answersObj);
    });
}

/**
 * [setDefault 设置prompts的默认值]
 * @author youzhao.zhou
 * @date   2018-01-12T11:43:23+0800
 * @param  {Object}                 opts [prompts所在对象]
 * @param  {[type]}                 key  [需要设置默认值的prompts的属性值(prompts[key])]
 * @param  {[type]}                 val  [默认值]
 */
function setDefault (opts, key, val) {
    if (opts.schema) {
        opts.prompts = opts.schema;
        delete opts.schema;
    }
    let prompts = opts.prompts || (opts.prompts = {});
    if (!prompts || typeof prompts !== 'object') {
        return prompts[key] = {
            type: 'string',
            default: val
        }
    }
    prompts[key].default = val;

}
/**
 * [checkPackageName 检测package.json的name字段是否符合要求]
 * @author youzhao.zhou
 * @date   2018-01-12T11:26:55+0800
 * @param  {Object}                 opt [inquirer.prompts的参数对象]
 * @param  {String}                 key [inquirer.prompts的参数的name值]
 * @return {Boolean}
 */
function checkPackageName (opt, key) {
    let customValidate = opt.validate;

    opt.validate = function (answer) {
        if (key === 'name') {
            let valid = validateName(answer);
            if (!valid.validForNewPackages) {
                let errors = (valid.errors || []).concat(valid.warnings || []);
                return `Error: ${errors.join(' & ')}`;
            }
        }
        if (typeof customValidate === 'function') {
            return customValidate(answer);
        }
        return true;
    }
}
