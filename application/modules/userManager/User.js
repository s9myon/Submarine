class User {
    constructor({ id, name, login, token, socketId }) {
        this.id = id; 
        this.name = name;
        this.login = login;
        this.token = token;
        this.socketId = socketId;
    }

    // сериализует информацию для неразрешенных пользователей
    get() {
        return {
            id: this.id,
            token: this.token,
            name: this.name
        };
    }
}

module.exports = User;