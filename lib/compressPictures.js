const fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    ora = require('ora'),
    globby = require('globby'),
    imagemin = require('imagemin'),
    imageminJpegtran = require('imagemin-jpegtran'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    imageminPngquant = require('imagemin-pngquant'),
    pipe = require('../lib/pipe.js');

exports = module.exports = compress;
let spinner = null;

function compress(opts) {
    spinner = ora('start compress ...').start();
    /**
     * 传入'.'，判断是否在当前文件夹
     */
    let isCurrentPlace = opts.dir === '.';
    /**
     * 如果在当前文件夹，则获取文件夹URL
     */
    let fileDir = isCurrentPlace ? process.cwd() : path.resolve(process.cwd(), opts.dir);

    let now = Date.now();
    globby(fileDir, {
        expandDirectories: {
            extensions: ['jpg', 'png', 'jpeg']
        }
    })
        .then((paths) => {
            let len = paths.length,
                pipeObj = pipe({
                    data: {}
                });
            paths.forEach(imgUrl => {
                pipeObj.next(function() {
                    imagemin([imgUrl], {
                        plugins: [
                            imageminJpegtran(),
                            imageminMozjpeg({quality: opts.quality}),
                            imageminPngquant({quality: opts.quality})
                        ]
                    })
                        .then((img) => {
                            fs.writeFileSync(imgUrl, img[0].data);
                            this.next();
                        })
                        .catch((err) => {
                            this.next(err);
                        });
                });
            });
            pipeObj
                .start()
                .end(function() {
                    let duration = Date.now() - now;
                    spinner.stop();
                    process.stdout.write(chalk.green('\nCompress Success!'));
                    process.stdout.write(chalk.green(`\nFile Number: ${len}`));
                    process.stdout.write(chalk.green(`\nTime: ${duration}ms`));
                })
                .catch(function(err) {
                    spinner.stop();
                    console.error(err);
                    process.stdout.write(chalk.red('\nCompress error: Pls try again!'));
                    process.exit(1);
                });
        })
        .catch(function(err) {
            spinner.stop();
            console.error(err);
            process.stdout.write(chalk.red('\nCompress error: Pls try again!'));
            process.exit(1);
        });
}