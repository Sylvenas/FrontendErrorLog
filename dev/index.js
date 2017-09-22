import FrontErrLog from './util';

let errlogger = new FrontErrLog({
    remoteLogging: true,
    remoteSettings: {
        url: 'http://39.108.124.75:3333/sendErrInfo',
        proId: '2a4db3c3-622b-4eea-b1ea-5e528fe54f24',
    }
});

var hello = null;

console.log(hello.length);