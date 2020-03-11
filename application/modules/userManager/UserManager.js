const md5 = require('md5');

class UserManager {
    constructor({ mediator, io, MESSAGES, db }) {

        this.db = db;
        this.MESSAGES = MESSAGES;

        this.users = {};

        if (!io) return;
        io.on('connection', socket => {
            socket.on(MESSAGES.USER_LOGIN, data => this.userLogin(data, socket));
            socket.on(MESSAGES.USER_LOGOUT, data => this.userLogout(data, socket));
            socket.on(MESSAGES.USER_REGISTRATION, data => this.userRegistration(data, socket));
        });
    }

    userLogout(data = {}, socket) {
        const { id, login } = data;
        this.db.setToken(null, login);
        delete this.users[id];
        socket.emit(this.MESSAGES.USER_LOGOUT, true);
    }

    async userLogin(data = {}, socket) {
        const { login, hash, random } = data;
        const user = await this.db.getUserByLogin(login);
        if (user) {
            let hashS = md5(user.password + random);
            if(hash == hashS) {
                let rnd = Math.random();
                let token = md5(login + rnd);
                this.db.setToken(token, login);
                user.token = token;
                this.users[user.id] = user;
            }
        }
        socket.emit(this.MESSAGES.USER_LOGIN, user ? user : null);
    }

    async userRegistration(data = {}, socket) {
        const { login, hash, name } = data;
        if(await this.db.getUserByLogin(login)){
            socket.emit(this.MESSAGES.USER_REGISTRATION, false);
            return;
        }
        if(login && hash && name) {
            this.db.addUser(login, hash, name);
        }
        socket.emit(this.MESSAGES.USER_REGISTRATION, true);
    }
}

module.exports = UserManager;