var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
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

// 登录
exports.login = function (userinfo, callback) {
    var collection = db.collection('user');
    collection.find(userinfo).toArray(function (err, docs) {
        if (err) throw err;
        callback(docs);
    })
}
// 注册
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
// 新建项目
exports.newProject = function (projectInfo, callback) {
    var collection = db.collection('user');
    collection.find({ "projects": { "$elemMatch": { "pName": projectInfo.pInfo.pName } } }).toArray(function (err, docs) {
        if (err) throw err;
        if (docs.length > 0) {
            callback(false)
        } else {
            collection.updateOne({ "_id": ObjectId(projectInfo.userId) }, { $push: { 'projects': projectInfo.pInfo } }, function (err, doc) {
                if (err) throw err;
                callback(doc);
            })
        }
    })
}

// 删除项目
exports.deleteProject = function (projectInfo, callback) {
    var collection = db.collection('user');
    collection.update({ "_id": ObjectId(projectInfo.userId) }, { $pull: { 'projects': { pId: projectInfo.pId } } }, function (err, doc) {
        if (err) throw err;
        callback(true)
    })
}

// 根据用户查询项目集合
exports.getColsByUserId = function (userId, callback) {
    var collection = db.collection('user');
    collection.find({ "_id": ObjectId(userId) }).toArray(function (err, docs) {
        if (err) throw err;
        callback(docs);
    })
}

// 根据项目ID查询具体错误信息
exports.getErrInfosByProId = function (proId, callback) {
    var col = db.collection('projectErrors');
    col.find(proId).toArray(function (err, docs) {
        if (err) throw err;
        callback(docs)
    })
}

exports.insert = function (data) {
    var collection = db.collection('projectErrors');
    collection.insertOne(data)
}