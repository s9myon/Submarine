class Equipment {
    constructor ({ position, status = 'worked', type}) {
        this.position = position || null;
        this.status = status;
        this.type = type;
        this.params = {};
    }
}
module.exports = Equipment ;