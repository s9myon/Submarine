const CONFIG = {
    PORT: 9000,

    DATABASE: {
        HOST: '',
        NAME: 'submarine.db',
        USER: '',
        PASS: ''
    },

    // список всех триггеров в системе
    TRIGGERS: {
        SQR: 'SQR',
        GET_USER_BY_TOKEN: 'GET_USER_BY_TOKEN'
    },

    // список всех событий в системе
    EVENTS: {
        EV1: 'ev1',
        EV2: 'ev2'
    },

    // список всех сокетных сообщений в системе
    MESSAGES: {
        // about user
        USER_LOGIN: 'USER_LOGIN',
        USER_REGISTRATION: 'USER_REGISTRATION',
        USER_LOGOUT: 'USER_LOGOUT',
        // about chat
        NEW_MESSAGE: 'NEW_MESSAGE', // новое сообщение в чат
        ADD_TO_ROOM: 'ADD_TO_ROOM'
        // about lobby
        // about game
    }
};

module.exports = CONFIG;