const fs = require('fs')
const path = require('path')
const qiniu = require('qiniu')
const userConfig = require('../config')
const root = userConfig.root
var mac = userConfig.mac
const bucket = userConfig.bucket
var options = {
    scope: bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = userConfig.zone;

var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

const RequestControl = require('../utils/RequestControl.js')
let middleControl = new RequestControl(5)
    //同步root文件夹的文件
function startSync() {
    walkDir(root, uploadFile)
}

function walkDir(dir, callback, prefix = '') {
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


function isExist(path) {
    let isExist = true
    try {
        fs.statSync(path)
    } catch (err) {
        isExist = false
    }
    return isExist
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


module.exports = startSync