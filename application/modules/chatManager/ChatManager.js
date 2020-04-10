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
            let roomId = this.mediator.get(this.TRIGGERS.GET_ROOMID_BY_USERID, user.id);
            if(roomId) {
                this.io.to(roomId).emit(this.MESSAGES.NEW_MESSAGE, { message: 'Пользователь ' + user.name + ' покинул вас.' });
            }
        }
    }

    /*       */
    /* LOGIC */
    /*       */

    async sendNewMessage(data = {}, socket) {
        const { message } = data;
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        const room = this.mediator.get(this.TRIGGERS.GET_ROOMID_BY_USERID, user.id);
        if(user) {
            this.io.to(room).emit(this.MESSAGES.NEW_MESSAGE, { name: user.name, message });
            //io.sockets.emit(this.MESSAGES.NEW_MESSAGE, { name: user.name, message: data.message });
        }
    }
}

module.exports = ChatManager;