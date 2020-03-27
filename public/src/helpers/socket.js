import openSocket from 'socket.io-client';

// создаём используемый сокет и экспортируем его для дальнейшего использования
const socket = openSocket('http://localhost:9000');

export default socket;