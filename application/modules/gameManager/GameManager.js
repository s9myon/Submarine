const BaseManager = require('../BaseManager');
const Game = require('./game/Game');

class GameManager extends BaseManager {
    constructor(options) {
        super(options);
        this.game = new Game({ 
            callbacks: { 
                // чтобы отдавалась только командирам
                refreshScene: scene => scene && this.io.local.emit(this.MESSAGES.UPDATE_SCENE, scene),
                // чтобы отдавалась всей команде
                getSubmarineCB: (gamer, submarine) => {
                    // взять по игроку пользователя
                    let user = this.mediator.get(this.TRIGGERS.GET_USER_BY_ID, gamer.id);
                    // и пользователю отдать его субмарину
                    let connectedUser = this.io.sockets.connected[user.socketId];
                    if(connectedUser) {
                        connectedUser.emit(this.MESSAGES.UPDATE_SCENE, submarine);
                    }
                }
            } 
        });

        if (!this.io) return;
        this.io.on('connection', socket => {
            socket.on(this.MESSAGES.START_GAME, data => data && this.startGame(data, socket));
            socket.on(this.MESSAGES.END_GAME, data => data && this.endGame(data, socket));
            socket.on(this.MESSAGES.COMMAND_GAME, data => data && this.commandGame(data, socket));

            socket.on('disconnect', () => {
                // дропнуть морячка с субмарины
                //...
            });
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
                this.io.in(team.roomId).emit(this.MESSAGES.START_GAME, true); // отправить сообщение о начале игры команде
                // создать субмарину
                this.game.addSubmarine({ 
                    name: 'submarine', 
                    size: 5, 
                    compartments: [
                        {  
                            name: 'подсобка',
                            x: 0, 
                            y: 0,  
                            length: 3, 
                            transitions: [1, 2], 
                            equipments: [
                                { position: 2, status: 'worked', type: 'cistern' }
                            ]
                        }, 
                        { 
                            name: 'рулевая',
                            x: 3, 
                            y: 0,  
                            length: 4, 
                            transitions: [1, 3, 4], 
                            equipments: [
                                { position: 2, status: 'worked', type: 'rudder' }
                            ]
                         }, 
                        { 
                            name: 'котельня',
                            x: 0, 
                            y: 1,  
                            length: 7, 
                            transitions: [2, 3], 
                            equipments: [
                                { position: 6, status: 'worked', type: 'engine' }
                            ]
                         }, 
                        { 
                            name: 'полигон',
                            x: 7, 
                            y: 0,  
                            length: 3, 
                            transitions: [4], 
                            equipments: [
                                { position: 2, status: 'worked', type: 'torpedo' }
                            ]
                         }], 
                    transitions: [
                        {
                            exit1: 1,
                            exit2: 2,
                            open: true
                        },
                        {
                            exit1: 1,
                            exit2: 3,
                            open: true
                        },
                        {
                            exit1: 2,
                            exit2: 3,
                            open: true
                        },
                        {
                            exit1: 2,
                            exit2: 4,
                            open: true
                        }
                    ], 
                    team, 
                    id: user.id
                });
                return;
            }
        }
        socket.emit(this.MESSAGES.START_GAME, false);
    }

    endGame(data, socket) {
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        if (user) {
            const team = this.mediator.get(this.TRIGGERS.GET_TEAM, user.id);
            if (team && this.isCaptain(team, user.id)) {
                this.io.in(roomId).emit(this.MESSAGES.END_GAME, true);
                this.mediator.get(this.TRIGGERS.REMOVE_TEAM, data, socket);
                return this.io.emit(this.MESSAGES.TEAM_LIST, this.mediator.get(this.TRIGGERS.GET_TEAMS));
            } else {
                socket.emit(this.MESSAGES.END_GAME, true);
            }
        }
        socket.emit(this.MESSAGES.END_GAME, false);
    }

    commandGame(data, socket) {
        const user = this.mediator.get(this.TRIGGERS.GET_USER_BY_TOKEN, data);
        const { command, options } = data;
        if (user && command) {
            const gamer = this.game.getGamer(user);
            if(gamer) {
                return socket.emit(this.MESSAGES.COMMAND_GAME, this.game.command(gamer, command, options));
            }
        }
        socket.emit(this.MESSAGES.COMMAND_GAME, false);
    }
}

module.exports = GameManager;