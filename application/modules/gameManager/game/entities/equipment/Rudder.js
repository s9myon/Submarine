class Rudder extends Equipment {
    constructor(options = {}) {
        options.type = 'Rudder';
        super(options);
        this.params = { 
            rudder: 0, // положение руля
            aileron: 0, // положение рулей высоты
        };
    }
}
module.exports = Rudder;