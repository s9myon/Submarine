class Compartment {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.length = 0;
        this.transitions = [];
        this.equipments = [];
        this.incidents = [];
    }
}
module.exports = Compartment;