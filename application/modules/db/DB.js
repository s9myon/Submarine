const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const sqlite = require('sqlite');
const ORM = require('./ORM');

class DB {
    constructor({ NAME }) {
        this.db;
        this.orm;
        sqlite.open(path.join(__dirname, NAME), sqlite3.Database).then(async db => {
            this.db = db;
            this.orm = new ORM(db);
        });
    }

    destructor() {
        if (this.db) this.db.close();
    }

    getUserByName(name) {
        return this.orm.detail('user', { name });
    }

    getUserByLogin(login) {
        return this.orm.detail('user', { login });
    }

    getUserByToken(token) {
        return this.orm.detail('user', { token });
    }

    addUser(login, password, name) {
        return this.orm.add('user', 'login, password, name', [login, password, name]);
    }

    setToken(token, login) {
        return this.orm.update('user', { token }, { login });
    }
}

module.exports = DB;