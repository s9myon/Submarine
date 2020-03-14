class ChatManager {
    constructor({ mediator, io, MESSAGES, db }) {
        if (!io) return;
        this.db = db;
        this.MESSAGES = MESSAGES;
        this.rooms = {};// комнаты { id: room }
        this.mediator = mediator;
        
        io.on('connection', socket => {
            socket.on(MESSAGES.NEW_MESSAGE, data => this.sendNewMessage(data, io, socket));
            socket.on(MESSAGES.ADD_TO_ROOM, data => this.addToRoom(data));
        });
    }

    addToRoom(data) {
        const { token, room } = data;
        const user = this.mediator.get('getUserByToken', token);
        this.rooms[user.id] = room;
    }

    async sendNewMessage(data = {}, io, socket) {
        const { token } = data;
        let user = this.mediator.get('getUserByToken', token);
        const room = this.rooms[user.id] ? this.rooms[user.id] : 'default';
        socket.join(room);
        if(user) {
            io.to(room).emit(this.MESSAGES.NEW_MESSAGE, { name: user.name, message: data.message });
            //io.sockets.emit(this.MESSAGES.NEW_MESSAGE, { name: user.name, message: data.message });
        }
    }
}

module.exports = ChatManager;