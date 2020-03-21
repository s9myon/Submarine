const md5 = require('md5');
const BaseManager = require('../BaseManager');

class UserManager extends BaseManager {
    constructor(options) {
        super(options);

        this.users = {};
        
        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.USER_LOGIN, data => this.userLogin(data, socket));
            socket.on(this.MESSAGES.USER_LOGOUT, data => this.userLogout(data, socket));
            socket.on(this.MESSAGES.USER_REGISTRATION, data => this.userRegistration(data, socket));
        });

        // настроить триггеры
        this.mediator.set('getUserByToken', data => this.getUserByToken(data));
    }

    getUserByToken(data = {}) {
        if (data.token) {
            for (let user in this.users) {
                if (this.users[user].token === data.token) return this.users[user];
            }
        }
        return null;
    }

    async userLogout(data = {}, socket) {
        let user = this.getUserByToken(data);
        if (user) {
            await this.db.setToken(null, user.login);
            delete this.users[user.id];
            return socket.emit(this.MESSAGES.USER_LOGOUT, true);
        }
        socket.emit(this.MESSAGES.USER_LOGOUT, false);
    }

    async userLogin(data = {}, socket) {
        const { login, hash, random } = data;
        let user;
        if (login && hash && random) {
            user = await this.db.getUserByLogin(login);
            if (user) {
                let hashS = md5(user.password + random);
                if (hash === hashS) {
                    let rnd = Math.random();
                    let token = md5(login + rnd);
                    await this.db.setToken(token, login);
                    user.token = token;
                    user.socketId = socket.id;
                    this.users[user.id] = user;
                }
            }
        }
        let teams = this.mediator.get('getTeams');//отправить команды сразу при входе
        socket.emit(this.MESSAGES.USER_LOGIN, { user, teams });
    }

    async userRegistration(data = {}, socket) {
        const { login, hash, name } = data;
        if (login && hash && name) {
            if (await this.db.getUserByLogin(login)) {
                return socket.emit(this.MESSAGES.USER_REGISTRATION, false);
            }
            if (login && hash && name) {
                await this.db.addUser(login, hash, name);
            }
            return socket.emit(this.MESSAGES.USER_REGISTRATION, true);
        }
        socket.emit(this.MESSAGES.USER_REGISTRATION, false);
    }
}

module.exports = UserManager;