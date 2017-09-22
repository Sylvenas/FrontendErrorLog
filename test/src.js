var ErrLogger = (function () {
    function ErrLogger(userConf) {
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
        window.removeEventListener('error', this.errListener);
    }
    ErrLogger.prototype.errListener = function (e) {
        if (this.options.detailedErrors) {
            this.detailedErrors(e);
        }
        if (this.options.remoteLogging) {
            this.remoteLogging(e, this.options.remoteSettings);
        }
    };
    ErrLogger.prototype.detailedErrors = function (e) {
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
    ErrLogger.prototype.remoteLogging = function (e, remoteSettings) {
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
        axios.post(url, params).then(function (res) {
            console.log(res.data);
        });
    };
    ErrLogger.prototype.errorData = function (e) {
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
    ErrLogger.prototype.serializeData = function (params) {
        return Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join('&');
    };
    return ErrLogger;
}());
