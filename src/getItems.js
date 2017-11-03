const qiniu = require('qiniu')
    // var accessKey = 'UFBLTy8tc_f_L0KxkuUuQTayBMl73SDpo80ZwYWe';
    // var secretKey = '8TWK6szB3_Bln3nsasl0HABei12a4UMvy5CyI8tf';
    // var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var user_config = require('../config')
var bucket = 'limg'

var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;

var bucketManager = new qiniu.rs.BucketManager(user_config.mac, config);



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
            console.log('nextMarker', nextMarker);
            console.log(commonPrefixes);
            var items = respBody.items;
            items.forEach(function(item) {
                if (typeof callback === 'function') {
                    callback(item)
                }
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




module.exports = getItems