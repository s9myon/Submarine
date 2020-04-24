class Submarine {
    constructor(name,size){
        this.name = name;
        this.compartments = [];
        this.transitions = [];
        this.team = [];

        this.position = { x: 0, y: 0, z: 0 };
        this.direction = { x: 0, y: 0, z: 0 };
        this.speed = { x: 0, y: 0, z: 0 };

        this.size = size;
    }

    // вернуть параметры субмарины неразрешенным игрокам
    get() {
        return {
            name: this.name,
            position: this.position,
            direction: this.direction,
            speed: this.speed,
            compartments: this.compartments,
            team: this.team
        };
    }
}
module.exports = Submarine;