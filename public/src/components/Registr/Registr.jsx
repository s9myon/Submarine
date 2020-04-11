import React from 'react';
import md5 from 'md5';
import './Registr.scss';

import socket from '../../helpers/socket';

class Registr extends React.Component {
    constructor(props) {
        super();
        this.MESSAGES = props.MESSAGES;
        this.setRegistrState = props.setRegistrState;

        socket.on(this.MESSAGES.USER_REGISTRATION, data => {
            if(data) {
                this.setRegistrState(false);
            }
        });
    }

    registration() {
        const login = document.querySelector('#loginRegistr').value;
        const password = document.querySelector('#passwordRegistr').value;
        const name = document.querySelector('#nameRegistr').value;
        if (login && password && name) {
            let hash = md5(password + login);
            socket.emit(this.MESSAGES.USER_REGISTRATION, { login, hash, name });
        }
    }

    render() {
        return(
            <div>
                <input id="loginRegistr" placeholder="Login"/>
                <input id="passwordRegistr" placeholder="Password"/>
                <input id="nameRegistr" placeholder="Name"/>
                <button id="userRegistration" onClick = { () => {this.registration(); this.setRegistrState(false); } }>Registration</button>
            </div>
        );
    }
}

export default Registr;