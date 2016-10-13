const path = require('path');
const mapLimit = require('async/mapLimit');
const api = require('./api');
const util = require('./util');

/**
 * 批量下载某个答案下的图片。
 * 
 * @param　url_token 问题页面URL中最后的数字串
 * @param　[offset] 从第几个答案开始下载
 * @param [limit] 最多获取几个答案的图片
 * @param [saveDir] 文件保存路径
 */
async function batchDownloadImages(url_token, offset = 0, limit = 0, saveDir = './images') {
    // 已处理的答案数量
    let n = 0;
    let downloader = new util.Downloader(10);

    loop:
    while (true) {
        let answers = await api.listAnswers(url_token, offset);
        if (!answers || answers.length === 0) break;

        for (let answer of answers) {
            let images = answer.images;

            if (images && images.length > 0) {
                let i = 0;
                for (let image of answer.images) {
                    let dir = path.join(saveDir, answer.authorName);
                    let filename = (++i) + path.extname(image);
                    downloader.download(image, dir, filename);
                }

                n += 1;

                console.log(`第${n}个用户：${answer.authorName}`);

                if (limit > 0 && n >= limit) {
                    break loop;
                }
            }
        }

        offset += 10;

        await util.sleep(0.1);
    }
}

module.exports = {
    batchDownloadImages
};
