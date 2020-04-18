const BaseManager = require('../BaseManager');

class ChatManager extends BaseManager {
    constructor(options) {
        super(options);        
        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.NEW_MESSAGE, data => this.sendNewMessage(data, socket));
        });
        // настроить события
        this.mediator.subscribe(this.EVENTS.LOGOUT, data => this.disconnect(data));
    }

    /*        */
    /* EVENTS */
    /*        */

    disconnect(data) {
        let user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        if(user) {
            let team = this.mediator.get(this.TRIGGERS.GET_TEAM, user.id);
            if(team) {
                this.io.to(team.roomId).emit(this.MESSAGES.NEW_MESSAGE, { message: 'Пользователь ' + user.name + ' покинул вас.' });
            }
        }
    }

    /*       */
    /* LOGIC */
    /*       */

    async sendNewMessage(data = {}, socket) {
        const { message } = data;
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        const team = this.mediator.get(this.TRIGGERS.GET_TEAM, user.id);
        if(user) {
            this.io.to(team.roomId).emit(this.MESSAGES.NEW_MESSAGE, { name: user.name, message });
        }
    }
}

module.exports = ChatManager;