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
    //用户登录
    app.post('/api/login', function (req, res) {
        var obj = req.body,
            data;
        db.login(obj, function (docs) {
            if (docs.length > 0) {
                data = {
                    status: true,
                    msg: '登录成功'
                }
                res.cookie('islogged', docs[0]._id, {
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
    });
    //用户注册
    app.post('/api/join', function (req, res) {
        var obj = Object.assign(req.body, { projects: [] }),
            data;
        db.join(obj, function (newUserId) {
            if (newUserId) {
                data = {
                    status: true,
                    msg: '注册成功'
                }
                res.cookie('islogged', newUserId, {
                    maxAge: 1000 * 60 * 60 * 24,
                    //httpOnly: true
                })
            } else {
                data = {
                    status: false,
                    msg: '注册失败'
                }
            }
            res.send(JSON.stringify(data))
        })
    });


    //新建项目
    app.post('/api/newProject', function (req, res) {

    })
    //单个项目上传和修改soursemap文件
    app.post('/api/uploadSM',function(req,res){
        
    })




    //根据用户查询错误信息
    app.post('/api/getErrInfoByUserId', function (req, res) {

    })
    //根据项目ID查询具体信息
    app.post('/api/getErrByProjectId', function (req, res) {

    })
}

db.connect(createServer);