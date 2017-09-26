## frontEndErrorLog

前端的错误，会根据客户端浏览器的不同，网络环境不同，或者是用户的非常规操作，导致的前端代码报错，很难重现某些不常见的错误；另一方面，为了速度和安全考虑，前端的代码都会经过编译和压缩混肴之后再上线，导致就算出现了错误，由于是压缩和混肴之后的代码，很难定位到报错的代码的具体文件，以及行数和列数，FrontEndErrorLog会记录下所有的报错的信息，然后传递到后端，根据sourcemap文件计算出，报错的地方在源代码的具体文件和位置，并保存到数据库，方便以后的查看

## 使用方法

#### 1.在[frontEndErrorLog](http://39.108.124.75:3333/join)注册账号

#### 2.在collections页面新建一个项目，会返回给你一个项目的ID,作为唯一标识码

#### 3.使用npm下载frontEndErrorLog

```
npm install --save frontend-errlog
```
#### 4.在项目的入口文件引入FrontErrLog
```js
import FrontErrLog from 'frontend-errlog';
```

``` js
let errlogger = new FrontErrLog({
    remoteLogging: true,
    remoteSettings: {
        url: 'http://39.108.124.75:3333/sendErrInfo',
        proId: '项目ID',
    }
});
```
#### 5.打包编译项目，生成sourcemap文件，并把文件上传到frontEndErrorLog网站上
