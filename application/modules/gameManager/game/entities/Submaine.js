class Submarine {
    constructor(x,y,z,size){
        this.compartments = [];
        this.transitions = [];
        this.team = [];
        this.speed = {x = 0, y = 0, z = 0};
        this.direction = {x = 0, y = 0, z = 0};
        this.pull = {x = 0,y = 0,z = 0};
        this.size = size;
    }
}
module.exports = Submarine;