class ChatManager {
    constructor({ mediator, io, MESSAGES, db }) {
        if (!io) return;
        this.db = db;
        this.MESSAGES = MESSAGES;

        io.on('connection', socket => {
            socket.on(MESSAGES.NEW_MESSAGE, data => this.sendNewMessage(data, io));
            // { 
            //     const { token } = data;
            //     const user = await db.getUserByToken(token);
            //     if(user) {
            //         io.local.emit(MESSAGES.NEW_MESSAGE, data);
            //     }
            // });
        });
    }

    async sendNewMessage(data = {}, io) {
        const { token } = data;
        let user = await this.db.getUserByToken(token);
        if(user) {
            io.sockets.emit(this.MESSAGES.NEW_MESSAGE, data);
        }
    }
}

module.exports = ChatManager;