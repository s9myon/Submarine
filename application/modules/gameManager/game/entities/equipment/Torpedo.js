class Torpedo extends Equipment {
    constructor (options = {}){
        options.type = 'Torpedo';
        super(options);
        const { count } = options;
        this.params = { 
            count, // количество торпед
            loaded: false, // заряжена торпеда или нет
            speed: 0, // скорость торпеды
            angle: 0, // угол
            deep: 0 // глубина 
        };
    }
    
    load(){};
    fire(){};
}