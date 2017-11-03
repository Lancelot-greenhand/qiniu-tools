// export const isExist = path => {
//     let isExist = true
//     try {
//         fs.statSync(path)
//     } catch (err) {
//         isExist = false
//     }
//     return isExist
// }
const isWindows = () => {
    let reg = /win/g
    return reg.test(process.platform)
}
module.exports = {
    isWindows
}