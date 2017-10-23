const qiniu = require('qiniu')
const userConfig = {
    root : '/Users/losingyoung/online-imgs',
    accessKey : 'UFBLTy8tc_f_L0KxkuUuQTayBMl73SDpo80ZwYWe',
    secretKey : '8TWK6szB3_Bln3nsasl0HABei12a4UMvy5CyI8tf',
    bucket : 'limg',
    zone: qiniu.zone.Zone_z0
}

userConfig.mac = new qiniu.auth.digest.Mac(userConfig.accessKey, userConfig.secretKey);


module.exports = userConfig