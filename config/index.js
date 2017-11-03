const qiniu = require('qiniu')
const { isWindows } = require('../utils/utils.js')
const userConfig = {
    root: 'E:\\qiniu_files',
    accessKey: 'UFBLTy8tc_f_L0KxkuUuQTayBMl73SDpo80ZwYWe',
    secretKey: '8TWK6szB3_Bln3nsasl0HABei12a4UMvy5CyI8tf',
    publicBucketDomain: 'ourrovucw.bkt.clouddn.com',
    bucket: 'limg',
    qiniu_config: new qiniu.conf.Config(),
    zone: qiniu.zone.Zone_z0,
    isWin: isWindows()
}

userConfig.mac = new qiniu.auth.digest.Mac(userConfig.accessKey, userConfig.secretKey);


module.exports = userConfig