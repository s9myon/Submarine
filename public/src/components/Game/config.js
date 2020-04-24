const CONFIG = {
    COMMANDS: {
        // перемещение
        MOVE_LEFT: 'MOVE_LEFT',
        MOVE_RIGHT: 'MOVE_RIGHT',
        MOVE_UP: 'MOVE_UP',
        MOVE_DOWN: 'MOVE_DOWN',
        // открыть/закрыть люки
        OPEN_DOOR: 'OPEN_DOOR',
        CLOSE_DOOR: 'CLOSE_DOOR',
        // команды для оборудования
        TURN_RUDDER: 'TURN_RUDDER', // повернуть штурвал (влево/вправо)
        TURN_AILERON: 'TURN_AILERON', // повернуть рули высоты (задрать нос вверх/вниз)

        ENGINE_POWER: 'ENGINE_POWER', // задать мощность двигателя (0..100)
        ENGINE_DIRECTION: 'ENGINE_DIRECTION', // направление работы двигателя (-1, 0, 1)

        CISTERN_FILL: 'CISTERN_FILL', // начать заполнять цистерну
        CISTERN_EMPTY: 'CISTERN_EMPTY', // начать продувать цистерну
        CISTERN_STOP: 'CISTERN_STOP', // прекратить действие с цистерной

        TORPEDO_LOAD: 'TORPEDO_LOAD', // зарядить торпеду
        TORPEDO_FIRE: 'TORPEDO_FIRE', // выстрелить торпедой (перед выстрелом принять в торпеду параметры выстрела: скорость, глубину, угол)
    }
};
export default CONFIG;
