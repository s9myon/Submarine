class Transition {
    constructor (exit1 = null, exit2 = null, open = true) {
        this.exit1 = exit1;
        this.exit2 = exit2;
        this.open = open; // true - открыто, false - закрыто
    }
}
module.exports = Transition;