class RequestControl {
    constructor(max) {
        this.max = max
        this.fnGroup = []
    }
    emit(data) {
        if (this.fnGroup.length < this.max) {
            data.fn.apply(null, data.args)
            return
        }
        this.fnGroup.push(data) // 修改
    }
    shift() {
        if (this.fnGroup.length === 0) {
            return
        }
        let data = this.fnGroup.shift()
        data.fn.apply(null, data.args)
    }
}
module.exports = RequestControl