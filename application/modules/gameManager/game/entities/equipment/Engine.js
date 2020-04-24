class Engine extends Equipment {
    constructor(options = {}) {
        options.type = 'Engine';
        super(options);
        const { power, direction } = options;
        this.params = { 
            power, // общая мощность двигателя
            currentPower: 0, // текущая мощность двигателя
            direction // направление работы двигателя (вперед/назад/стоит)
        };
    }
}
module.exports = Engine;