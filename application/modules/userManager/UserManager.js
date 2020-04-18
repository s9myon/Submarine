const md5 = require('md5');
const BaseManager = require('../BaseManager');
const User = require('./User');

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
        this.mediator.set(this.TRIGGERS.GET_USER_BY_TOKEN, data => this.getUserByToken(data));
        this.mediator.set(this.TRIGGERS.GET_USER_BY_ID, id => this.getUserById(id));
        // настроить события
        this.mediator.subscribe(this.EVENTS.LOGOUT, async data => await this.disconnect(data));
    }

    /*        */
    /* EVENTS */
    /*        */

    async disconnect(data) {
        let user = this.getUserByToken(data);
        if (user) {
            await this.db.setToken(null, user.login); // занулить токен
            delete this.users[user.id]; // удалить пользователя из списка
        }
    }

    /*          */
    /* TRIGGERS */
    /*          */

    getUserByToken(data = {}) {
        if (data.token) {
            for (let id in this.users) {
                if (this.users[id].token === data.token) return this.users[id];
            }
        }
        return null;
    }

    getUserById(id){
        if (id) {
            for (let key in this.users) {
                if (this.users[key].id === id) return this.users[key];
            }
        }
        return null;
    }

    /*       */
    /* LOGIC */
    /*       */

    async userLogout(data = {}, socket) {
        this.mediator.call(this.EVENTS.LOGOUT, data);// вызвать все подписанные события
        return socket.emit(this.MESSAGES.USER_LOGOUT, true);
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
                    this.users[user.id] = new User(user);
                    socket.emit(this.MESSAGES.USER_LOGIN, this.users[user.id].get());
                    socket.emit(this.MESSAGES.TEAM_LIST, this.mediator.get(this.TRIGGERS.GET_TEAMS)); //отправить команды сразу при входе
                    return;
                }
            }
        }
        socket.emit(this.MESSAGES.USER_LOGIN, false);
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