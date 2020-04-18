class Cistern extends Equipment {
    constructor(options = {}){
        options.type = 'Cistern';
        super(options);
        const { volume, currentVolume } = options;
        this.params = { 
            volume, // общий объем цистерны
            currentVolume // заполненность цистерны (в процентах)
        };
    }

    fill() {} // Наполнить
    empty() {} //опорожнить
    stop() {}
}
module.exports = Cistern;