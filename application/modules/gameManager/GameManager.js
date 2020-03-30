const BaseManager = require('../BaseManager');

class GameManager extends BaseManager {
    constructor(options) {
        super(options);
        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.START_GAME, (data) => data && this.startGame(data, socket));
            socket.on(this.MESSAGES.END_GAME, (data) => data && this.endGame(data, socket));
        });
    }
    isCaptain(team, captainId) {
        return team.players.find(player => player.role == 'captain' && player.id === captainId);
    }

    startGame(data, socket) {
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        if (user) {
            const team = this.mediator.get(this.TRIGGERS.GET_TEAM, user.id);
            if (team && this.isCaptain(team, user.id)) { // если капитан команды
                let roomId = this.mediator.get(this.TRIGGERS.GET_ROOMID_BY_USERID, user.id);
                return this.io.in(roomId).emit(this.MESSAGES.START_GAME, true); // отправить сообщение о начале игры команде
            }
        }
        socket.emit(this.MESSAGES.START_GAME, false);
    }

    endGame(data, socket) {
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        if (user) {
            const team = this.mediator.get(this.TRIGGERS.GET_TEAM, user.id);
            if (team) {
                if (this.isCaptain(team, user.id)) {
                    let roomId = this.mediator.get(this.TRIGGERS.GET_ROOMID_BY_USERID, user.id);
                    this.io.in(roomId).emit(this.MESSAGES.END_GAME, true);
                    this.mediator.get(this.TRIGGERS.REMOVE_TEAM, data, socket);
                    return this.io.emit(this.MESSAGES.TEAM_LIST);
                }
                else {
                    socket.emit(this.MESSAGES.END_GAME, true);
                }
            }
        }   
        socket.emit(this.MESSAGES.END_GAME, false);
    }
}

module.exports = GameManager;