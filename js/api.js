
const agent = require('superagent');
const cheerio = require('cheerio');
const IMG_POSTFIX = /_[rb]/;

/**
 * 列出某个问题的所有回答。
 * 
 * @param　url_token 问题页面URL中最后的数字串
 * @param　[offset] 从第几个答案开始
 */
async function listAnswers(url_token, offset = 0) {
    let res = await agent
        .post('https://www.zhihu.com/node/QuestionAnswerListV2')
        .type('form')
        .send({
            method: 'next',
            params: JSON.stringify({ url_token, offset, pagesize: 10 })
        });

    let answers = res.body.msg.map(str => {
        var $ = cheerio.load(str);
        let $answer = $('.zm-item-answer');
        let $author = $answer.find('.author-link').first();
        let $content = $answer.children('.zm-item-rich-text');
        let images = [];

        $content.find('.zm-editable-content > img').each(function () {
            var $this = $(this);
            let src = $this.data('original') || $this.data('actualsrc');
            if (src) {
                images.push(src.replace(IMG_POSTFIX, ''));
            }
        });

        return {
            authorName: $content.data('author-name'),
            authorLink: $author.attr('href'),
            link: $content.data('entry-url'),
            images: images
        };
    });

    return answers;
}

module.exports = { listAnswers };
