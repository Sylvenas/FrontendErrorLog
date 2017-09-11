import ErrLogger from './errlogger.js';

let errlogger = new ErrLogger({
    remoteLogging: true,
    remoteSettings: { url: 'http://39.108.124.75:3333/sendErrInfo' }
});
let a = {};
let HELLO=null;
function myFunction(a, b) {
    return a * b;
}
// console.log(a.b.c)
console.log(HELLO[0])
myFunction();