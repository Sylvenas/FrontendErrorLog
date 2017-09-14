var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sourceMap = require('source-map');
var axios = require('axios');
var fs = require('fs');
var path = require('path');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var db = require('./db');

var server = server.listen(3333, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
})


var createServer = function () {

    //建立socket链接
    io.on('connection', function (socket) {
        console.log('web-socket connected successfully!')
    })

    function setData(data) {
        io.emit('getData', JSON.stringify(data))
    }


    app.use(express.static('./web/dist'));

    app.use(bodyParser.json());

    app.use(cookieParser());

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './web/dist/index.html'));
    });



    app.post('/api/sendErrInfo', function (req, res) {
        var _this = this;
        var obj = req.body;
        var _res = res;

        fs.readFile('./map/app.js.map', 'utf8', function (err, data) {
            var smc = new sourceMap.SourceMapConsumer(JSON.parse(data));
            var sourse = smc.originalPositionFor({
                line: req.body.line,
                column: req.body.column
            })
            obj.source = sourse;
            setData(obj);
            db.insert(JSON.parse(JSON.stringify(obj)));
            _res.send('错误日志插入数据库成功');
        });
    });

    app.post('/api/getErrinfo', function (req, res) {
        var obj = req.body;
        db.query(obj, function (docs) {
            res.send(docs)
        })
    });

    app.post('/api/login', function (req, res) {
        var obj = req.body,
            data;
        db.login(obj, function (docs) {
            if (docs.length > 0) {
                data = {
                    status: true,
                    msg: '登录成功'
                }
                res.cookie('islogged', 1, {
                    maxAge: 1000 * 60 * 60 * 24,
                    //httpOnly: true
                })
            } else {
                data = {
                    status: false,
                    msg: '密码不正确'
                }
            }
            res.send(JSON.stringify(data))
        })
    })
}

db.connect(createServer);