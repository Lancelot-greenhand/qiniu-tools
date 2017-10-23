const fs = require('fs')
const path = require('path')
const qiniu = require('qiniu')
const RequestControl = require('./utils/RequestControl.js')
const config = require('./config')
const root = config.root
const accessKey = config.accessKey
const secretKey = config.secretKey
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const bucket = config.bucket
var options = {
    scope: bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;

var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

var bucketManager = new qiniu.rs.BucketManager(mac, config);


//同步root文件夹的文件
function startSync(root, prefix) {
    walkDir(root, uploadFile, prefix)
}

function deleteFile(item) {
    var key = item
    if (isPlainObject(key)) {
        key = key.key
        item = null
    }
    // console.log('删除key', key)
    bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
        if (err) {
            console.log('删除错误', err);
            //throw err;
        } else {
            console.log('删除状态', respInfo.statusCode);
            console.log('已删除', key);
        }
    });
}

function isPlainObject(data) {
    var isObj = false
    if (Object.prototype.toString.call(data) === '[object Object]') {
        isObj = true
    }
    return isObj
}

function isString(data) {
    var isStr = false
    if (Object.prototype.toString.call(data) === '[object Strng]') {
        isStr = true
    }
    return isStr
}

function getItems({ prefix, limit }, callback) {
    // let bucket = bucket;
    // @param options 列举操作的可选参数
    //                prefix    列举的文件前缀
    //                marker    上一次列举返回的位置标记，作为本次列举的起点信息
    //                limit     每次返回的最大列举文件数量
    //                delimiter 指定目录分隔符
    var options = {
        limit,
        prefix
    };
    bucketManager.listPrefix(bucket, options, function(err, respBody, respInfo) {
        if (err) {
            console.log(err);
            throw err;
        }
        if (respInfo.statusCode == 200) {
            //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
            //指定options里面的marker为这个值
            var nextMarker = respBody.marker;
            var commonPrefixes = respBody.commonPrefixes;
            console.log(nextMarker);
            console.log(commonPrefixes);
            var items = respBody.items;
            items.forEach(function(item) {
                callback(item)
                console.log('获取到文件', item);
                // console.log(item.putTime);
                // console.log(item.hash);
                // console.log(item.fsize);
                // console.log(item.mimeType);
                // console.log(item.endUser);
                // console.log(item.type);
            });
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
        }
    });
}

let middleControl = new RequestControl(5)


function walkDir(dir, callback, prefix = 'phdi') {
    fs.readdir(dir, (err, files) => {
        files.forEach(file => {
            let filePath = path.join(dir, file)
            let newName = path.join(prefix, file)
            fs.stat(filePath, (err, stat) => {
                // 如果是文件夹
                if (stat.isDirectory()) {
                    walkDir(filePath, callback, newName)
                    return
                }
                filePath = path.normalize(filePath).replace(/\\/g, '/')
                newName = path.normalize(newName).replace(/\\/g, '/')
                let args = [filePath, newName]
                middleControl.emit({
                    fn: callback,
                    args
                })
            })
        })
    })
}



// 文件上传
function uploadFile(localFilePath, name) {
    formUploader.putFile(uploadToken, name, localFilePath, putExtra, function(respErr,
        respBody, respInfo) {
        middleControl.shift()
        if (respErr) {
            throw respErr;
        }
        if (respInfo.statusCode == 200) {
            console.log(respBody);
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
        }
    });
}

// startSync(root, 'phdi')
console.log(process.argv)

// getItems({ prefix: 'node_modules/', limit: 1000 }, deleteFile)