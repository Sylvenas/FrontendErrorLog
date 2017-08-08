import ErrLogger from './errlogger.js';

let errlogger = new ErrLogger({
    remoteLogging: true,
    remoteSettings: { url: 'http://localhost:3333/' }
});
let a = {};
let b=null;
function myFunction(a, b) {
    return a * b;
}
// console.log(a.b.c)
console.log(b[0])
myFunction();