/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _errlogger = __webpack_require__(1);

var _errlogger2 = _interopRequireDefault(_errlogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errlogger = new _errlogger2.default();
var a = {};

console.log(a.b.c);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(2);
const browser_js_1 = __webpack_require__(4);
class ErrLogger {
    constructor(userConfig) {
        this.errListener = e => {
            console.log(this.browserInfo);
            if (this.options.detailedErrors) {
                this.detailedErrors(e);
            }
            if (this.options.remoteLogging) {
                this.remoteLogging(e, this.options.remoteSettings);
            }
        };
        if (!userConfig)
            userConfig = {};
        // Default configuration
        let defaultConfig = {
            detailedErrors: true,
            remoteLogging: false,
            remoteSettings: {
                url: null,
                additionalParams: null,
                successCallback: null,
                errorCallback: null
            }
        };
        this.browserInfo = new browser_js_1.default();
        // Override with user config
        this.options = Object.assign(defaultConfig, userConfig);
        //Remove current listener
        window.removeEventListener('error', this.errListener);
        // Listen to errors
        window.addEventListener('error', this.errListener);
    }
    detailedErrors(e) {
        let i = this.errorData(e);
        let helpPath = encodeURI("https://stackoverflow.com/search?q=" + i.error.split(' ').join('+'));
        let str = [
            "%cType: %c" + i.type,
            "%cError: %c" + i.error,
            "%cStackTrace: %c" + i.stackTrace,
            "%cFile Name: %c" + i.filename,
            "%cPath: %c" + i.path,
            "%cLine: %c" + i.line,
            "%cColumn: %c" + i.column,
            "%cDate: %c" + i.datetime,
            "%cDebug : %c" + i.path + ':' + i.line,
            "%cGet Help: " + "%c" + helpPath
        ].join("\n");
        if (this.browserInfo.browser === 'Chrome') {
            console.log(str, "font-weight: bold;", "color: #e74c3c;", "font-weight: bold;", "font-weight: normal; color: #e74c3c;", "font-weight: bold;", "font-weight: normal; color: #e74c3c;", "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal; color: #3498db;");
        }
        else {
            console.log(str.replace(/%c/gi, ''));
        }
    }
    remoteLogging(e, remoteSettings) {
        if (!remoteSettings.url) {
            throw new Error('Provide remote URL to log errors remotely');
        }
        else if (remoteSettings.additionalParams && typeof remoteSettings.additionalParams !== 'object') {
            throw new Error('Invalid data type, additionalParams should be a valid object');
        }
        var http = new XMLHttpRequest();
        var url = remoteSettings.url;
        var data = this.errorData(e);
        var setData = Object.assign(data, remoteSettings.additionalParams);
        var params = this.serializeData(setData);
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(params);
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                if (http.readyState == XMLHttpRequest.DONE) {
                    if (remoteSettings.successCallback) {
                        remoteSettings.successCallback();
                    }
                }
                else {
                    if (remoteSettings.errorCallback) {
                        remoteSettings.errorCallback();
                    }
                    else {
                        throw new Error('Remote error logging failed!');
                    }
                }
            }
        };
    }
    errorData(e) {
        let filename = e.filename.lastIndexOf('/');
        let datetime = new Date().toString();
        //userAgent only for POST request purposes, not required in pretty print
        return {
            type: e.type,
            path: e.filename,
            filename: e.filename.substring(++filename),
            line: e.lineno,
            column: e.colno,
            error: e.message,
            stackTrace: ((e.error) ? e.error.stack.toString().replace(/(\r\n|\n|\r)/gm, "") : ""),
            datetime: datetime,
            userAgent: navigator.userAgent || window.navigator.userAgent
        };
    }
    serializeData(params) {
        return Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join('&');
    }
}
exports.default = ErrLogger;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.assign = __webpack_require__(3);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 浏览器解析，浏览器、Node.js皆可
 * https://github.com/mumuy/browser
 */

var Browser = function Browser(userAgent) {
    _classCallCheck(this, Browser);

    var _window = window || {};
    var _navigator = navigator || {};
    var u = userAgent || _navigator.userAgent;
    var _this = this;

    var match = {
        //内核
        'Trident': u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
        'Presto': u.indexOf('Presto') > -1,
        'WebKit': u.indexOf('AppleWebKit') > -1,
        'Gecko': u.indexOf('Gecko/') > -1,
        //浏览器
        'Safari': u.indexOf('Safari') > -1,
        'Chrome': u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
        'IE': u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
        'Edge': u.indexOf('Edge') > -1,
        'Firefox': u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
        'Firefox Focus': u.indexOf('Focus') > -1,
        'Chromium': u.indexOf('Chromium') > -1,
        'Opera': u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
        'Vivaldi': u.indexOf('Vivaldi') > -1,
        'Yandex': u.indexOf('YaBrowser') > -1,
        'Kindle': u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
        '360': u.indexOf('360EE') > -1 || u.indexOf('360SE') > -1,
        'UC': u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
        'QQBrowser': u.indexOf('QQBrowser') > -1,
        'QQ': u.indexOf('QQ/') > -1,
        'Baidu': u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
        'Maxthon': u.indexOf('Maxthon') > -1,
        'Sogou': u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
        'LBBROWSER': u.indexOf('LBBROWSER') > -1,
        '2345Explorer': u.indexOf('2345Explorer') > -1,
        'TheWorld': u.indexOf('TheWorld') > -1,
        'XiaoMi': u.indexOf('MiuiBrowser') > -1,
        'Quark': u.indexOf('Quark') > -1,
        'Qiyu': u.indexOf('Qiyu') > -1,
        'Wechat': u.indexOf('MicroMessenger') > -1,
        'Taobao': u.indexOf('AliApp(TB') > -1,
        'Alipay': u.indexOf('AliApp(AP') > -1,
        'Weibo': u.indexOf('Weibo') > -1,
        'Douban': u.indexOf('com.douban.frodo') > -1,
        'Suning': u.indexOf('SNEBUY-APP') > -1,
        'iQiYi': u.indexOf('IqiyiApp') > -1,
        //系统或平台
        'Windows': u.indexOf('Windows') > -1,
        'Linux': u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
        'Mac OS': u.indexOf('Macintosh') > -1,
        'Android': u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
        'Ubuntu': u.indexOf('Ubuntu') > -1,
        'FreeBSD': u.indexOf('FreeBSD') > -1,
        'Debian': u.indexOf('Debian') > -1,
        'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
        'BlackBerry': u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
        'MeeGo': u.indexOf('MeeGo') > -1,
        'Symbian': u.indexOf('Symbian') > -1,
        'iOS': u.indexOf('like Mac OS X') > -1,
        'Chrome OS': u.indexOf('CrOS') > -1,
        'WebOS': u.indexOf('hpwOS') > -1,
        //设备
        'Mobile': u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
        'Tablet': u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1
    };
    //修正
    if (match['Mobile']) {
        match['Mobile'] = !(u.indexOf('iPad') > -1);
    } else if (_window.showModalDialog && _window.chrome) {
        match['360'] = true;
    }
    //基本信息
    var hash = {
        engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
        browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Kindle', '360', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
        os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
        device: ['Mobile', 'Tablet']
    };
    _this.device = 'PC';
    _this.language = function () {
        var g = _navigator.browserLanguage || _navigator.language;
        var arr = g.split('-');
        if (arr[1]) {
            arr[1] = arr[1].toUpperCase();
        }
        return arr.join('_');
    }();
    for (var s in hash) {
        for (var i = 0; i < hash[s].length; i++) {
            var value = hash[s][i];
            if (match[value]) {
                _this[s] = value;
            }
        }
    }
    //系统版本信息
    var osVersion = {
        'Windows': function Windows() {
            var v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
            var hash = {
                '6.4': '10',
                '6.3': '8.1',
                '6.2': '8',
                '6.1': '7',
                '6.0': 'Vista',
                '5.2': 'XP',
                '5.1': 'XP',
                '5.0': '2000'
            };
            return hash[v] || v;
        },
        'Android': function Android() {
            return u.replace(/^.*Android ([\d.]+);.*$/, '$1');
        },
        'iOS': function iOS() {
            return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
        },
        'Debian': function Debian() {
            return u.replace(/^.*Debian\/([\d.]+).*$/, '$1');
        },
        'Windows Phone': function WindowsPhone() {
            return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
        },
        'Mac OS': function MacOS() {
            return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
        },
        'WebOS': function WebOS() {
            return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
        }
    };
    _this.osVersion = '';
    if (osVersion[_this.os]) {
        _this.osVersion = osVersion[_this.os]();
        if (_this.osVersion == u) {
            _this.osVersion = '';
        }
    }
    //浏览器版本信息
    var version = {
        'Safari': function Safari() {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
        },
        'Chrome': function Chrome() {
            return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
        },
        'IE': function IE() {
            return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
        },
        'Edge': function Edge() {
            return u.replace(/^.*Edge\/([\d.]+).*$/, '$1');
        },
        'Firefox': function Firefox() {
            return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
        },
        'Firefox Focus': function FirefoxFocus() {
            return u.replace(/^.*Focus\/([\d.]+).*$/, '$1');
        },
        'Chromium': function Chromium() {
            return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
        },
        'Opera': function Opera() {
            return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
        },
        'Vivaldi': function Vivaldi() {
            return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
        },
        'Yandex': function Yandex() {
            return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
        },
        'Kindle': function Kindle() {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
        },
        'Maxthon': function Maxthon() {
            return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
        },
        'QQBrowser': function QQBrowser() {
            return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
        },
        'QQ': function QQ() {
            return u.replace(/^.*QQ\/([\d.]+).*$/, '$1');
        },
        'Baidu': function Baidu() {
            return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1');
        },
        'UC': function UC() {
            return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
        },
        'Sogou': function Sogou() {
            return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
        },
        '2345Explorer': function Explorer() {
            return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1');
        },
        'TheWorld': function TheWorld() {
            return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
        },
        'XiaoMi': function XiaoMi() {
            return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
        },
        'Quark': function Quark() {
            return u.replace(/^.*Quark\/([\d.]+).*$/, '$1');
        },
        'Qiyu': function Qiyu() {
            return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
        },
        'Wechat': function Wechat() {
            return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
        },
        'Taobao': function Taobao() {
            return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
        },
        'Alipay': function Alipay() {
            return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
        },
        'Weibo': function Weibo() {
            return u.replace(/^.*weibo__([\d.]+).*$/, '$1');
        },
        'Douban': function Douban() {
            return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
        },
        'Suning': function Suning() {
            return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
        },
        'iQiYi': function iQiYi() {
            return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
        }
    };
    _this.version = '';
    if (version[_this.browser]) {
        _this.version = version[_this.browser]();
        if (_this.version == u) {
            _this.version = '';
        }
    }
    //修正
    if (_this.browser == 'Edge') {
        _this.engine = 'EdgeHTML';
    } else if (_this.browser == 'Chrome' && parseInt(_this.version) > 27) {
        _this.engine = 'Blink';
    } else if (_this.browser == 'Opera' && parseInt(_this.version) > 12) {
        _this.engine = 'Blink';
    } else if (_this.browser == 'Yandex') {
        _this.engine = 'Blink';
    }
};

exports.default = Browser;

/***/ })
/******/ ]);
//# sourceMappingURL=errlogger.js.map