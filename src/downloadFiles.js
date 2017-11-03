var qiniu = require('qiniu')
var fs = require('fs')
var path = require('path')
var request = require('request')
var user_config = require('../config')
var mac = user_config.mac
var config = user_config.qiniu_config
var bucketManager = new qiniu.rs.BucketManager(mac, config);

var publicBucketDomain = user_config.publicBucketDomain


function getUrl(key) {
    // 公开空间访问链接
    var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
    return publicDownloadUrl
}

function downloadFiles(url, key) {
    var completeUrl = addUrlPrfix(url)
    var filePath = path.join(user_config.root, key)
    var dirPath = getDirPath(filePath)
    makeSureDir(dirPath)
        // request
        //     .get(completeUrl)
        //     .on('response', function(response) {
        //         console.log(response.statusCode) // 200
        //         console.log(response.headers['content-type']) // 'image/png'
        //     })
        //     .pipe(fs.createWriteStream(filePath))
}

function addUrlPrfix(url) {
    var newUrl = url
    var reg = new RegExp(/^http(s)?:\/\//)
    if (reg.test(url)) return newUrl
    newUrl = 'http://' + newUrl
    return newUrl
}
// /fff/ddd.png => /fff
function getDirPath(filePath) {
    console.log(user_config.isWin)
    var reg = user_config.isWin ? /(.*)\\.*\..*$/ : /(.*)\/.*\..*$/
    var result = filePath.match(reg)
    if (!Array.isArray(result) || !result[1]) return filePath
    return result[1]
}
// 查找dir， 若没有 创建
function makeSureDir(dir) {
    dir = "E:\\qiniu_files\phdi"
    try {
        var stat = fs.statSync(dir)
    } catch (err) {
        console.log('err')
    }
}
module.exports = {
    getUrl,
    downloadFiles
}