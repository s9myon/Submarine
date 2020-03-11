class Member {
    constructor(koef, power) {
        this.koef = koef || 0;
        this.power = power || 0;
    }

    getValue(x) {
        return this.koef * Math.pow(x, this.power);
    }
}
module.exports = Member;