const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DB {
    constructor({ NAME }) {
        this.db = new sqlite3.Database(path.join(__dirname, NAME));
    }

    destructor() {
        if (this.db) this.db.close();
    }

    getUserByLogin(login) {
        return new Promise(resolve => this.db.serialize(() => {
            const query = "SELECT * FROM user WHERE login=?";
            this.db.get(query, [login], (err, row) => resolve(err ? null : row));
        }));
    }

    getUserByToken(token) {
        return new Promise(resolve => this.db.serialize(() => {
            const query = "SELECT * FROM user WHERE token=?";
            this.db.get(query, [token], (err, row) => resolve(err ? null : row));
        }));
    }

    addUser(login, password, name) {
        const query = "INSERT INTO user (login, password, name) VALUES (?, ?, ?)";
        this.db.run(query, [login, password, name]);
    }

    getUserByLoginPass(login, password) {
        return new Promise(resolve => this.db.serialize(() => {
            const query = "SELECT * FROM user WHERE login=? AND password=?";
            this.db.get(query, [login, password], (err, row) => resolve(err ? null : row));
        }));
    }

    setToken(token, login) {
        const query = "UPDATE user SET token=? WHERE login=?";
        this.db.run(query, [token, login]);
    }
}

module.exports = DB;