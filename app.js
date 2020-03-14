const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
// append sockets
const io = require('socket.io').listen(server);

const CONFIG = require('./config');
const { PORT, TRIGGERS, EVENTS, MESSAGES, DATABASE } = CONFIG; // конфига

const bodyParser = require('body-parser'); // модуль для POST-запроса

// классы модулей
const Mediator = require('./application/modules/Mediator'); // медиатор
const DB = require('./application/modules/db/DB'); // базонька с данными
const PolyMath = require('./application/modules/polynomial/polyMath'); // математический модуль для многочленов
const UserManager = require('./application/modules/userManager/UserManager');
const ChatManager = require('./application/modules/chatManager/ChatManager');

// подключение модулей
const mediator = new Mediator({ TRIGGERS, EVENTS });
const db = new DB(DATABASE);
const polyMath = new PolyMath();

new UserManager({ mediator, io, MESSAGES, db });
new ChatManager({ mediator, io, MESSAGES, db });

io.on('connection', socket => {
	console.log('connected', socket.id);
	socket.on('disconnect', () => console.log('disconnect', socket.id));
});

// router
const Router = require('./application/router/Router');
const router = new Router({ mediator, polyMath });
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/', router);

function deinitModules() {
    db.destructor();
}

server.listen(PORT, () => console.log(`Port is ${PORT}`));

//process.on('exit', deinitModules);
//process.on('SIGINT', deinitModules); // CTRL + C