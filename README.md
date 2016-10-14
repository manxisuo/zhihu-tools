# 知乎工具集

用Node编写的一些与知乎相关的工具

## 编译

如果你使用的Node版本不支持Async/Await，那么需要用Babel转译。执行Gulp任务：
```
gulp babel
```
将在./build目录下生成tool.js。

## 功能列表

1. 批量下载某个问题下答案中的图片。
```javascript
const tool = require('./build/tool');
tool.batchDownloadImages('37709992', 0);
tool.batchDownloadImages('37709992', 10, 20);
tool.batchDownloadImages('37709992', 0, 20, './images');
```
