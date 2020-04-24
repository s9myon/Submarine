const CONFIG = require('./config');
const Submarine = require('./entities/Submaine');
const Compartment = require('./entities/Compartment');
const Transition = require('./entities/Transition');

class Game {
    constructor({ callbacks = {} }) {
        const { COMMANDS, TIMEUPDATE, SCENEUPDATE } = CONFIG;
        this.COMMANDS = COMMANDS;
        this.TIMEUPDATE = TIMEUPDATE;
        this.submarines = {}; // ключ - идентификатор командира
        this.map;
        this.ships = {};
        this.timestamp = (new Date()).getTime(); // общеигровое время
        // коллбеки
        //this.refreshScene = callbacks.refreshScene instanceof Function ? callbacks.refreshScene(this.getScene()) : () => {};
        this.refreshScene = callbacks.refreshScene instanceof Function ? () => callbacks.refreshScene(this.getScene()) : () => {};
        this.getSubmarineCB = (callbacks.getSubmarineCB instanceof Function)
            ? gamer => callbacks.getSubmarineCB(gamer, this.getSubmarine(gamer))
            : () => {};
        this.delSubmarine = callbacks.delSubmarine instanceof Function ? id => callbacks.delSubmarine(id) : () => {};
        this.delSailor = callbacks.delSailor instanceof Function ? (subId, SailorId) => callbacks.delSailor(subId, SailorId) : () => {};

        // общий старт игры
        setInterval(() => this.updateScene(), SCENEUPDATE);
    }

    // добавить новую субмарину
    addSubmarine(options) {
        const { name, size, compartments, transitions, team, id } = options;
        let submarine = new Submarine(name, size);
        submarine.compartments = compartments;
        submarine.transitions = transitions;
        submarine.team = team;
        this.submarines[id] = submarine;
        this.refreshScene();
    }

    // удалить субмарину (она или померла, или капитан включил истеричку и вышел)
    delSubmarine(id) {
        delete this.submarines[id];
        this.refreshScene();
        return true;
    }

    // удалить морячка из субмарины
    delSailor(subId, sailorId) {
        delete this.submarines[subId].team.players[sailorId];
        return true;
    }

    // среди субмарин найти игрока по id пользователя
    getGamer(user) {
        for(let subId in this.submarines) {
            // for (let teamId in this.sybmarines[subId].team) {
            //     if(this.submarines[subId].team[teamId] == user.id){
            //         return user;
            //     }
            // }
            return this.submarines[subId].team.players.find(player => player.id === user.id);
        }
        return false;
    }

    // взять субмарину игрока
    getSubmarine(gamer) {
        for(let subId in this.submarines) {
            if(this.submarines[subId].team.players.find(val => val.id === gamer.id)) {
                return this.submarines[subId];
            }
        }
        return false;   
    }

    move(submarine, gamer, direction) {
        if (submarine && gamer) {
            //...
            return true;
        }
        return false;
    }

    // установить состояние двери (открыто/закрыто)
    setDoor(submarine, options, open) {
        const { exit1, exit2 } = options;
        let transition = submarine.transitions.find(transition => transition.exit1 === exit1 && transition.exit2 === exit2);
        if(transition) {
            transition.open = open;
            return true;
        }
        return false;
    }

    // найти оборудование в субмарине по типу (в конкретном отсеке по x, y)
    findEquipment(submarine, type, options = {}) {
        for(let cKey in submarine.compartments) {
            let compartment = submarine.compartments[cKey];
            //if(compartment.x === options.x && compartment.y == options.y) {} // в конкретном отсеке
            for(let eKey in compartment.equipments) {
                let equipment = compartment.equipments[eKey];
                if(equipment.type === type) {
                    return equipment;
                }
            }
        }
        return null;
    }

    // установить положение руля (штурвал/руль высоты)
    setRudder(submarine, options, param) {
        if(!options[param]) return false;
        if(options[param] > 100 || options[param] < -100) return false; // если задано некорректное значение
        let rudder = this.findEquipment(submarine, 'Rudder');
        if(rudder) {
            rudder.params[param] = options[param];
            return true;
        }
        return false;
    }

    // установить мощность/направление двигателя
    setEngine(submarine, options, param) {
        if(!options[param]) return false;
        // если задано некорректное значение для мощности
        if(param === 'power' && (options[param] < 0 || options[param] > 100)) return false;
        // если задано некорректное значение для направления
        if(param === 'direction' && (options[param] != 0 && options[param] != 1 && options[param] != -1)) return false; 
        let engine = this.findEquipment(submarine, 'Engine');
        if(engine) {
            engine.params[param] = options[param];
            return true;
        }
        return false;
    }

    // настроить цистерну (по координатам конктретного отсека)
    setCistern(submarine, options, param) {
        let cistern = this.findEquipment(submarine, 'Cistern', { x: options.x || null, y: options.y || null });
        if(cistern) {
            switch(param) {
                case 'fill': 
                    cistern.fill();
                    return true;
                case 'empty': 
                    cistern.empty();
                    return true;
                case 'stop': 
                    cistern.stop();
                    return true;
            }
        }
        return false;
    }

    // настроить торпеду (по координатам конктретного отсека)
    setTorpedo(submarine, options, param) {
        let torpedo = this.findEquipment(submarine, 'Torpedo', { x: options.x || null, y: options.y || null });
        if(torpedo) {
            switch(param) {
                case 'load': 
                    torpedo.load();
                    return true;
                case 'fire':
                    torpedo.speed = options.speed || 0;
                    torpedo.angle = options.angle || 0;
                    torpedo.deep = options.deep || 0;
                    torpedo.fire();
                    return true;
            }
        }
        return false;
    }

    // какая-либо команда игрока
    command(gamer, command, options) {
        switch (command) {
            case this.COMMANDS.MOVE_LEFT: return this.move(this.getSubmarine(gamer), gamer, 'left');
            case this.COMMANDS.MOVE_RIGHT: return this.move(this.getSubmarine(gamer), gamer, 'right');
            case this.COMMANDS.MOVE_UP: return this.move(this.getSubmarine(gamer), gamer, 'up');
            case this.COMMANDS.MOVE_DOWN: return this.move(this.getSubmarine(gamer), gamer, 'down');
            // открыть/закрыть дверь
            case this.COMMANDS.OPEN_DOOR: return this.setDoor(this.getSubmarine(gamer), options, true);
            case this.COMMANDS.CLOSE_DOOR: return this.setDoor(this.getSubmarine(gamer), options, false);
            // управление положением руля, руля высоты
            case this.COMMANDS.TURN_RUDDER: return this.setRudder(this.getSubmarine(gamer), options, 'rudder');
            case this.COMMANDS.TURN_AILERON: return this.setRudder(this.getSubmarine(gamer), options, 'aileron');
            // управление двигателем (мощность, направление)
            case this.COMMANDS.ENGINE_POWER: return this.setEngine(this.getSubmarine(gamer), options, 'power');
            case this.COMMANDS.ENGINE_DIRECTION: return this.setEngine(this.getSubmarine(gamer), options, 'direction');
            // управление цистерной (наполнить, опорожнить, остановить)
            case this.COMMANDS.CISTERN_FILL: return this.setCistern(this.getSubmarine(gamer), options, 'fill');
            case this.COMMANDS.CISTERN_EMPTY: return this.setCistern(this.getSubmarine(gamer), options, 'empty');
            case this.COMMANDS.CISTERN_STOP: return this.setCistern(this.getSubmarine(gamer), options, 'stop');
            // управление торпедой (зарядить, запустить)
            case this.COMMANDS.TORPEDO_LOAD: return this.setTorpedo(this.getSubmarine(gamer), options, 'load');
            case this.COMMANDS.TORPEDO_FIRE: return this.setTorpedo(this.getSubmarine(gamer), options, 'fire');
        }
        // 2. проверить, что название команды корректное
        // 3. проверить, что параметры команды релевантные
        // 4. выполнить команду
        //...
        return false;
    }

    getScene() {
        const timestamp = (new Date()).getTime();
        if (timestamp - this.timestamp >= this.TIMEUPDATE) {
            this.timestamp = timestamp;
            // набрать субмарины
            const submarines = [];
            for (let key in this.submarines) {
                submarines.push(this.submarines[key].get());
            }
            return {
                submarines,
                map: this.map,
                ships: this.ships
            };
        }
    }

    // обновить игровой мир
    updateScene() {
        let canRefresh = false;
        for(let sKey in this.submarines) {
            let submarine = this.submarines[sKey];
            // изменить параметры оборудования
            for(let i = 0; i < submarine.compartments.length; i++) {
                for(let j = 0; j < submarine.compartments[i].equipments.length; j++) {
                    let equipment = submarine.compartments[i].equipments[j];
                    switch(equipment.type) {
                        case 'Engine':
                            if(equipment.power < equipment.currentPower) {
                                equipment.currentPower -= 5;
                            } else if (equipment.power > equipment.currentPower) {
                                equipment.currentPower += 5;
                            }
                            break;
                    }
                }
            }
            // переместить игроков (по желанию)
            // изменяем характеристики субмарины по её оборудованию 
            // переместить торпеды
            // нанести повреждения
            // утопить субмарину
            // убить погибших игроков

        }
        // вызывать не всегда, а только в том случае, если сцена действительно изменилась
        if (canRefresh) {
            // пробежаться по всем субмаринам
                // пробежаться по каждому члену команды субмарины
                // и для каждого члена команды субмарины вызвать this.getSubmarineCB(gamer);
            for(let sKey in this.submarines) {
                for(let pKey in this.submarines[sKey].team.players){
                    this.getSubmarineCB(this.submarines[sKey].team.players[pKey]);
                }
            }
            this.refreshScene();
        }
    }
}

module.exports = Game;