class Helm extends Equipment {
    constructor(options = {}){
        options.type = 'Helm';
        super(options);
        const {rotation, elevator} = options;
        options.params = {rotation, elevator};
    }
}
module.exports = Helm;