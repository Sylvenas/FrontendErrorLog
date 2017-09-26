import Browser from './browser';

interface Conf {
    detailedErrors?: boolean;
    remoteLogging?: boolean;
    remoteSettings?: {
        url?: string;
        proId: string;
        additionalParams?: any;
        successCallback?: any;
        errorCallback?: any;
    }
}

export default class FrontendErrLog {

    private options: Conf;
    private browserInfo: Browser;

    constructor(userConf: Conf) {
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
        if (!userConf) userConf = {};
        let defaultConfig: Conf = {
            detailedErrors: true,
            remoteLogging: false,
            remoteSettings: {
                url: null,
                proId: null,
                additionalParams: null,
                successCallback: null,
                errorCallback: null
            }
        }
        this.options = (<any>Object).assign(defaultConfig, userConf);
        this.browserInfo = new Browser();
        window.removeEventListener('error', this.errListener);
        window.addEventListener('error', this.errListener);
    }
    public errListener = e => {
        if (this.options.detailedErrors) {
            this.detailedErrors(e);
        }
        if (this.options.remoteLogging) {
            this.remoteLogging(e, this.options.remoteSettings);
        }
    }
    private detailedErrors(e) {
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
        } else {
            console.log(str.replace(/%c/gi, ''));
        }
    }
    private remoteLogging(e, remoteSettings) {
        if (!remoteSettings.url) {
            throw new Error('Provide remote URL to log errors remotely');
        } else if (remoteSettings.additionalParams && typeof remoteSettings.additionalParams !== 'object') {
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
                } else {
                    if (remoteSettings.errorCallback) {
                        remoteSettings.errorCallback();
                    } else {
                        throw new Error('Remote error logging failed!');
                    }
                }
            }
        };
    }

    private errorData(e) {
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
    private serializeData(params) {
        return Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join('&');
    }
}
