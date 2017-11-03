const fs = require('fs')


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







// const startSync = require('./src/syncFiles.js')
// startSync()

// const getItems = require('./src/getItems.js')
// getItems({ prefix: '', limit: 100 })
var key = "phdi/pr03.png"
const download = require('./src/downloadFiles.js')
var url = download.getUrl(key)
download.downloadFiles(url, key)
    // console.log(url)