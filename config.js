const CONFIG = {
    PORT: 3000,

    DATABASE: {
        HOST: '',
        NAME: 'submarine.db',
        USER: '',
        PASS: ''
    },

    // список всех триггеров в системе
    TRIGGERS: {
        SQR: 'SQR'
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
        NEW_MESSAGE: 'NEW_MESSAGE' // новое сообщение в чат
        // about lobby
        // about game
    }
};

module.exports = CONFIG;