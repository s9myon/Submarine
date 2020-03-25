const BaseManager = require('../BaseManager');

class ChatManager extends BaseManager {
    constructor(options) {
        super(options);

        this.rooms = {};// комнаты { id: room }
        
        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.NEW_MESSAGE, data => this.sendNewMessage(data, socket));
        });
    }

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