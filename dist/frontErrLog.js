"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var browser_1 = require("./browser");
var FrontendErrLog = (function () {
    function FrontendErrLog(userConf) {
        var _this = this;
        this.errListener = function (e) {
            if (_this.options.detailedErrors) {
                _this.detailedErrors(e);
            }
            if (_this.options.remoteLogging) {
                _this.remoteLogging(e, _this.options.remoteSettings);
            }
        };
        if (typeof Object.assign != 'function') {
            Object.assign = function (target) {
                'use strict';
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }
                target = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source != null) {
                        for (var key in source) {
                            if (Object.prototype.hasOwnProperty.call(source, key)) {
                                target[key] = source[key];
                            }
                        }
                    }
                }
                return target;
            };
        }
        if (!userConf)
            userConf = {};
        var defaultConfig = {
            detailedErrors: true,
            remoteLogging: false,
            remoteSettings: {
                url: null,
                proId: null,
                additionalParams: null,
                successCallback: null,
                errorCallback: null
            }
        };
        this.options = Object.assign(defaultConfig, userConf);
        this.browserInfo = new browser_1.default();
        window.removeEventListener('error', this.errListener);
        window.addEventListener('error', this.errListener);
    }
    FrontendErrLog.prototype.detailedErrors = function (e) {
        var i = this.errorData(e);
        var helpPath = encodeURI("https://stackoverflow.com/search?q=" + i.error.split(' ').join('+'));
        var str = [
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
    };
    FrontendErrLog.prototype.remoteLogging = function (e, remoteSettings) {
        if (!remoteSettings.url) {
            throw new Error('Provide remote URL to log errors remotely');
        }
        else if (remoteSettings.additionalParams && typeof remoteSettings.additionalParams !== 'object') {
            throw new Error('Invalid data type, additionalParams should be a valid object');
        }
        if (!remoteSettings.proId) {
            throw new Error('Invalid data type, proId should be a string');
        }
        var http = new XMLHttpRequest();
        var url = remoteSettings.url;
        var data = this.errorData(e);
        var params = Object.assign(data, remoteSettings.additionalParams, { proId: remoteSettings.proId });
        params = this.serializeData(params);
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
    };
    FrontendErrLog.prototype.errorData = function (e) {
        var filename = e.filename.lastIndexOf('/');
        var datetime = new Date().toString();
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
    };
    FrontendErrLog.prototype.serializeData = function (params) {
        return Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join('&');
    };
    return FrontendErrLog;
}());
exports.default = FrontendErrLog;
//# sourceMappingURL=frontErrLog.js.map