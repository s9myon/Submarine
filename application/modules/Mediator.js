class Mediator {
    constructor({ TRIGGERS, EVENTS }) {
        this.triggers = {}; // список триггеров
        this.events = {}; // список событий
        this.TRIGGERS = TRIGGERS; // список названий триггеров
        this.EVENTS = EVENTS; // список названий событий
        // инициализация событий
        /*for (let key in this.EVENTS) {
            this.events[this.EVENTS[key]] = [];
        }*/
        Object.keys(this.EVENTS).forEach(
            key => this.events[this.EVENTS[key]] = []
        );
    }

    getTriggers() {
        return this.TRIGGERS;
    }

    set(name, func) {
        if (name && func instanceof Function) {
            this.triggers[name] = func;
        }
    }

    get(name, data) {
        if (name && this.triggers[name] instanceof Function) {
            return this.triggers[name](data);
        }
        return null;
    }

    getEvents() {
        return this.EVENTS;
    }

    subscribe(name, func) {
        if (name && this.events[name] && func instanceof Function) {
            this.events[name].push(func);
        }
    }

    call(name, data) {
        if (name && this.events[name]) {
            this.events[name].forEach(
                func => func instanceof Function && func(data)
            );
        }
    }
}

module.exports = Mediator;