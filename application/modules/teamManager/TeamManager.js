const BaseManager = require('../BaseManager');
const Player = require('./Player');

class TeamManager extends BaseManager {
    constructor(options) {
        super(options);

        this.ROLE = {
            CAPTAIN: 'captain',
            SAILOR: 'sailor' // морячок
        };
        this.teams = {};
        
        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.CREATE_TEAM, data => this.createTeam(data, socket));
            socket.on(this.MESSAGES.REMOVE_TEAM, data => this.removeTeam(data, socket));
            /*
        CREATE_TEAM: 'CREATE_TEAM',
        REMOVE_TEAM: 'REMOVE_TEAM',
        JOIN_TO_TEAM: 'JOIN_TO_TEAM',
        LEAVE_TEAM: 'LEAVE_TEAM',
        KICK_FROM_TEAM: 'KICK_FROM_TEAM', // выкинуть из команды
             */
        });
    }

    removeTeam(data, socket) {
        const user = this.mediator.get('getUserByToken', data);
        if (user) {
            const team = this.teams[user.id];
            if (team && 
                team.players.find(
                    player => player.id === user.id && player.role === this.ROLE.CAPTAIN
                )
            ) { // если капитан команды
                // команде сказать, что команда удалена
                this.io.in(team.roomId).emit(this.MESSAGES.REMOVE_TEAM, true);
                // всю команду выкинуть из комнаты

                console.log(team);
                console.log();

                /*this.io.sockets.clients(team.roomId).forEach(s => {
                    s.leave(team.roomId);
                });*/
                // удалить команду
                delete this.teams[user.id];
                this.io.emit(this.MESSAGES.TEAM_LIST, this.teams);
                return;
            }
        }
        socket.emit(this.MESSAGES.REMOVE_TEAM, false);
    }

    createTeam(data, socket) {
        const { name } = data;
        const user = this.mediator.get('getUserByToken', data);
        if (name && user) {
            const roomId = this.common.getRoomId();
            this.teams[user.id] = { 
                name,
                players: [new Player(user.id, user.name, this.ROLE.CAPTAIN)],
                roomId
            };
            socket.join(roomId);
            this.io.emit(this.MESSAGES.TEAM_LIST, this.teams);
            socket.emit(this.MESSAGES.CREATE_TEAM, true);
            return;
        }
        socket.emit(this.MESSAGES.CREATE_TEAM, false);
    }
}

module.exports = TeamManager;