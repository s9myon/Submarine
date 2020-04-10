class Cistern extends Equipment {
    constructor(options = {}){
        options.type = 'Cistern';
        super(options);
    }

    fill(){}// Наполнить
    empty(){}//опорожнить
}
module.exports = Cistern;