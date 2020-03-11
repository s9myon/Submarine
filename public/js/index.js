window.onload = function () {

    const { MESSAGES } = CONFIG;

    const socket = io('http://localhost:3000');
    
    function sendMessage() {
        //const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        socket.emit(MESSAGES.NEW_MESSAGE, { token : localStorage.getItem('token'), message });
    }

    function newMessage(data) {
        let chat = document.getElementById('chat');
        let div = document.createElement('div');
        div.innerHTML = `<b>${data.name}</b>: ${data.message}`;
        chat.appendChild(div);
    }

    function auth() {
        const login = document.getElementById('loginAuth').value;
        const password = document.getElementById('passwordAuth').value;
        if (login && password) {
            let random = Math.random();
            let hash = md5(md5(password + login) + random);
            socket.emit(MESSAGES.USER_LOGIN, { login, hash, random });
        }
    }

    function logout() {
        socket.emit(MESSAGES.USER_LOGOUT, { token : localStorage.getItem('token') });
        localStorage.removeItem('token');
    }

    function registration() {
        const login = document.getElementById('loginRegistr').value;
        const password = document.getElementById('passwordRegistr').value;
        const name = document.getElementById('nameRegistr').value;
        if (login && password && name) {
            let hash = md5(password + login);
            socket.emit(MESSAGES.USER_REGISTRATION, { login, hash, name });
        }
    }

    document.getElementById('newMessage').addEventListener('click', sendMessage);
    document.getElementById('userLogin').addEventListener('click', auth);
    document.getElementById('userLogout').addEventListener('click', logout);
    document.getElementById('userRegistration').addEventListener('click', registration);

    socket.on(MESSAGES.NEW_MESSAGE, newMessage);
    socket.on(MESSAGES.USER_LOGIN, data => {
        localStorage.setItem('token', data.token);
        console.log(localStorage.getItem('token'));
    });
    socket.on(MESSAGES.USER_LOGOUT, data => {
        console.log(localStorage.getItem('token'));
    });
    socket.on(MESSAGES.USER_REGISTRATION, data => console.log(data));
};