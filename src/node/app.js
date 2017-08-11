var express = require('express');
var bodyParser = require('body-parser');
var sourceMap = require('source-map');
var axios = require('axios');
var fs = require('fs');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server)

//建立socket链接
io.on('connection', function (socket) {
    console.log('连接成功!')
})

function setData(data) {
    io.emit('getData', JSON.stringify(data))
}




app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/', function (req, res) {
    var _this = this;
    var obj = req.body;
    var _res = res;
    axios.get(req.body.path + '.map').then(res => {
        var smc = new sourceMap.SourceMapConsumer(res.data);
        var sourse = smc.originalPositionFor({
            line: req.body.line,
            column: req.body.column
        })
        obj.source = sourse
        fs.writeFile('log.txt', JSON.stringify(obj), function (err) {
            if (err) {
                throw err;
            }
            console.log('已生成错误日志');
            setData(obj)
            _res.send('错误日志生成成功');
        })
    })
});

var server = server.listen(3333, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});