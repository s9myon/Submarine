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
        this.mediator.set('getTeams', () => this.getTeams());
        this.mediator.set('getRoomIdByUserId', (data) => this.getRoomIdByUserId(data));
        
        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.CREATE_TEAM, data => this.createTeam(data, socket));
            socket.on(this.MESSAGES.REMOVE_TEAM, data => this.removeTeam(data, socket));
            socket.on(this.MESSAGES.JOIN_TO_TEAM, data => this.joinToTeam(data, socket));
            socket.on(this.MESSAGES.LEAVE_TEAM, data => this.leaveTeam(data, socket));
            socket.on(this.MESSAGES.TEAM_LIST, () => this.teams);
            /*
                CREATE_TEAM: 'CREATE_TEAM',
                REMOVE_TEAM: 'REMOVE_TEAM',
                JOIN_TO_TEAM: 'JOIN_TO_TEAM',
                LEAVE_TEAM: 'LEAVE_TEAM',
                KICK_FROM_TEAM: 'KICK_FROM_TEAM', // выкинуть из команды
             */
        });
    }

    getTeams() {
        return this.teams;
    }

    deleteEmptyTeams() {
        for(let teamId in this.teams) {
            if(this.teams[teamId].players.length === 0) {
                delete this.teams[teamId];
            }
        }
    }

    getRoomIdByUserId(id) {
        let team = null;
        for(let teamId in this.teams) {
            if(this.teams[teamId].players.find(player => id == player.id)){
                team = teamId;
            }
        }
        return team ? this.teams[team].roomId : null;
    }

    getTeamIdByName(name) {
        let teamId = Object.keys(this.teams).find(key => this.teams[key].name === name);
        return teamId ? teamId : null;
    }

    getTeamIdByRoomId(roomId) {
        let teamId = Object.keys(this.teams).find(key => this.teams[key].roomId === roomId);
        return teamId ? teamId : null;
    }

    deleteFromTeam(player, teamId) {
        let players = this.teams[teamId].players;
        for(let i = 0; i < players.length; i ++) {
            if(players[i].id === player.id) {
                this.teams[teamId].players.splice(i, 1);
                return;
            }
        }
    }

    deleteUserFromAllTeams(user, socket) {
        for(let teamId in this.teams) {
            let player = this.teams[teamId].players.find(player => player.id === user.id);
            if(player) {
                socket.leave(this.teams[teamId].roomId);
                if(player.role === this.ROLE.CAPTAIN){
                    delete this.teams[teamId];
                    return;
                }
                this.deleteFromTeam(player, teamId);
            }
        }
        this.deleteEmptyTeams();
    }

    joinToTeam(data, socket) {
        const { roomId } = data;
        const user = this.mediator.get('getUserByToken', data);
        if(user) {
            this.deleteUserFromAllTeams(user, socket);
            const teamId = this.getTeamIdByRoomId(roomId);
            socket.join(roomId);
            this.teams[teamId].players.push(new Player(user.id, user.name, this.ROLE.SAILOR));
            socket.emit(this.MESSAGES.JOIN_TO_TEAM, true);
            this.io.emit(this.MESSAGES.TEAM_LIST, this.teams);
            return;
        }
        socket.emit(this.MESSAGES.JOIN_TO_TEAM, false);
    }

    leaveTeam(data, socket) {
        const user = this.mediator.get('getUserByToken', data);
        if(user) {
            this.deleteUserFromAllTeams(user, socket);
            this.io.emit(this.MESSAGES.LEAVE_TEAM, true);
            this.io.emit(this.MESSAGES.TEAM_LIST, this.teams);
            return;
        }
        this.io.emit(this.MESSAGES.LEAVE_TEAM, false);
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
                if(this.io.sockets.adapter.rooms[team.roomId]) {
                    let sockets = this.io.sockets.adapter.rooms[team.roomId].sockets;// object{ socketID: true/false }
                    for(let socketId in sockets) {
                        let socketCon = this.io.sockets.connected[socketId];
                        socketCon.leave(team.roomId);
                    }
                }
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
            if(this.teams[user.id]) { //если уже создал свою команду
                socket.emit(this.MESSAGES.CREATE_TEAM, false);
                return;
            }
            this.deleteUserFromAllTeams(user, socket);
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