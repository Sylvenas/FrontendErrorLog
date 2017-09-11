var express = require('express');
var bodyParser = require('body-parser');
var sourceMap = require('source-map');
var axios = require('axios');
var fs = require('fs');

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
        console.log('连接成功!')
    })

    function setData(data) {
        io.emit('getData', JSON.stringify(data))
    }


    app.use(express.static('public'));

    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.post('/sendErrInfo', function (req, res) {
        var _this = this;
        var obj = req.body;
        var _res = res;

        fs.readFile('./map/errlogger.js.map', 'utf8', function (err, data) {
            console.log(data)
            var smc = new sourceMap.SourceMapConsumer(data);
            var sourse = smc.originalPositionFor({
                line: req.body.line,
                column: req.body.column
            })
            obj.source = sourse;
            setData(obj);
            db.insert(JSON.stringify(obj));
            _res.send('错误日志插入数据库成功');
        });
    });

    app.post('/getErrinfo', function (req, res) {
        var obj = req.body;
        db.query(obj, function (docs) {
            res.send(docs)
        })
    })
}

db.connect(createServer);