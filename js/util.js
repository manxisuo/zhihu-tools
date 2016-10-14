const https = require('https');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const queue = require('async/queue');

/**
 * 暂停指定的时间。
 * 
 * @param secs 暂停的毫秒数
 * @returns Promise
 */
function sleep(secs) {
    return new Promise(resolve => {
        setTimeout(resolve, secs * 1000);
    });
}

/**
 * 新建一个目录。
 * 支持多级目录。
 * 
 * @returns Promise
 */
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        mkdirp(dir, function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

/**
 * 下载一个文件。
 * 
 * @private
 * @param url 文件的URL
 * @param filepath 文件保存的路径
 * @returns Promise
 */
function _download(url, filepath) {
    return new Promise((resolve, reject) => {
        let file = fs.createWriteStream(filepath);
        https.get(url, res => {
            res.on('data', data => {
                file.write(data);
            });
            res.on('end', data => {
                file.end();
                resolve();
            });
        });
    });
}

/**
 * 文件下载器。
 * 能够控制并发下载的文件数。
 */
class Downloader {
    constructor(concurrency) {
        this.queue = queue(({url, filepath}, callback) => {
            _download(url, filepath).then(callback);
        }, concurrency);
    }

    /**
     * 下载文件。
     * 
     * @param url 文件的URL
     * @param dir 文件保存的目录
     * @param [filename] 文件保存的名称
     */
    download(url, dir, filename) {
        if (!filename) filename = path.basename(url);
        mkdir(dir).then(() => {
            let filepath = path.join(dir, filename);
            this.queue.push({ url, filepath });
        });
    }
}

module.exports = { Downloader, sleep, mkdir };
