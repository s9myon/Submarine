const BaseManager = require('../BaseManager');

class ChatManager extends BaseManager {
    constructor(options) {
        super(options);

        this.rooms = {};// комнаты { id: room }
        
        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.NEW_MESSAGE, data => this.sendNewMessage(data, io, socket));
            socket.on(this.MESSAGES.ADD_TO_ROOM, data => this.addToRoom(data));
        });
    }

    addToRoom(data) {
        const { token, room } = data;
        const user = this.mediator.get('getUserByToken', token);
        this.rooms[user.id] = room;
    }

    async sendNewMessage(data = {}, io, socket) {
        const { message } = data;
        let user = this.mediator.get('getUserByToken', data);
        const room = this.rooms[user.id] ? this.rooms[user.id] : 'default';
        socket.join(room);
        if(user) {
            io.to(room).emit(this.MESSAGES.NEW_MESSAGE, { name: user.name, message });
            //io.sockets.emit(this.MESSAGES.NEW_MESSAGE, { name: user.name, message: data.message });
        }
    }
}

module.exports = ChatManager;