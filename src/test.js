import ErrLogger from './errlogger.js';

let errlogger = new ErrLogger({
    remoteLogging: true,
    remoteSettings: { url: 'http://39.108.124.75:3333/sendErrInfo' }
});