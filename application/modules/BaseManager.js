class BaseManager {
    constructor({ mediator, io, MESSAGES, db, common }) {
        this.db = db;
        this.io = io;
        this.MESSAGES = MESSAGES;
        this.common = common;
        this.mediator = mediator;
        this.TRIGGERS = mediator.getTriggers();
        this.EVENTS = mediator.getEvents();
    }
}

module.exports = BaseManager;