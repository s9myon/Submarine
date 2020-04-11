class Submarine {
    constructor(x,y,z,size){
        this.compartments = [];
        this.transitions = [];
        this.team = null;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.directionZ = 0;
        this.pullX = 0;
        this.pullY = 0;
        this.pullZ = 0;
        this.size = size;
    }
}
module.exports = Submarine;