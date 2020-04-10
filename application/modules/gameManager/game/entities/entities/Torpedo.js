class Torpedo extends Equipment {
    constructor (options = {}){
        options.type = 'Torpedo';
        super(options);
        const {speed, angle, deep} = options;
        options.params = {speed, angle, deep};
    }
    load(){};
    fire(){};
}
module.exports = Torpedo;