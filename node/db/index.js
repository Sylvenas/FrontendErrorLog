var MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/fontenderr';
var db;

// 连接数据库

exports.connect = function (callback) {
    MongoClient.connect(DB_CONN_STR, function (err, database) {
        if (err) throw err;
        db = database;
        callback();
        console.log('mongodb fontenderr connected successfully');
    });
}

exports.insert = function (data) {
    var collection = db.collection('json');
    collection.insertOne(data)
}

exports.query = function (cond,callback) {
    var collection = db.collection('json');
    collection.find().toArray(function (err, docs) {
        if (err) throw err;
        callback(docs);
    })
}


