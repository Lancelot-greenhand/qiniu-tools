export const isExist = path => {
    let isExist = true
    try {
        fs.statSync(path)
    } catch (err) {
        isExist = false
    }
    return isExist
}