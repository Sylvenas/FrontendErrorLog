var MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/frontenderr';
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

exports.query = function (cond, callback) {
    var collection = db.collection('json');
    collection.find().toArray(function (err, docs) {
        if (err) throw err;
        callback(docs);
    })
}

exports.login = function (userinfo, callback) {
    var collection = db.collection('user');
    collection.find(userinfo).toArray(function (err, docs) {
        if (err) throw err;
        callback(docs);
    })
}

exports.join = function (joininfo, callback) {
    var collection = db.collection('user');
    collection.find({ username: joininfo.username }).toArray(function (err, docs) {
        if (err) throw err;
        if (docs.length > 0) {
            callback(false);
        } else {
            collection.insert(joininfo, function (err, records) {
                if (err) throw err;
                console.log(records.insertedIds[0])
                callback(records.insertedIds[0]);
            })
        }
    })
}

