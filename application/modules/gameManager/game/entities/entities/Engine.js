class Engine extends Equipment {
    constructor (options = {}) {
        options.type = 'Engine';
        super(options);
        const { power, direction }= options;
        options.params = {power, direction};
    }
}
module.exports = Engine;