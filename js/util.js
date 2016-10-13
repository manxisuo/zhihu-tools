const https = require('https');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
let queue = require('async/queue')

function sleep(secs) {
    return new Promise(resolve => {
        setTimeout(resolve, secs * 1000);
    });
}

function mkdir(dir) {
    return new Promise((resolve, reject) => {
        mkdirp(dir, function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

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


let d_queue = null;


class Downloader {
    constructor(concurrency) {
        this.queue = queue(({url, filepath}, callback) => {
            _download(url, filepath).then(callback);
        }, concurrency);
    }
    download(url, dir, filename) {
        if (!filename) filename = path.basename(url);

        mkdir(dir).then(() => {
            let filepath = path.join(dir, filename);
            this.queue.push({ url, filepath });
        });
    }
}

// 下载文件
function download(url, dir, filename) {

}

module.exports = { Downloader, sleep, mkdir };
