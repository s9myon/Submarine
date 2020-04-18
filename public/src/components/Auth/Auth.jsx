import React from 'react';
import md5 from 'md5';
import './Auth.scss';
import './../../index.css';

import socket from '../../helpers/socket';

class Auth extends React.Component {
  constructor(props) {
    super();
    this.MESSAGES = props.MESSAGES;
    // колбеки
    this.setAuthState = props.setAuthState;
    this.setRegistrState = props.setRegistrState;

    socket.on(this.MESSAGES.USER_LOGIN, user => {
      if(user && user.token && user.id) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('id', user.id);
        this.setAuthState(false);
      } else {
        console.log('Ошибка авторизации!!!');
      }
    });
    socket.on(this.MESSAGES.USER_LOGOUT, data => data && (this.setAuthState(true) || localStorage.removeItem('token') || localStorage.removeItem('id')));
  }

  auth() {
    const login = document.querySelector('#loginAuth').value;
    const password = document.querySelector('#passwordAuth').value;
    if (login && password) {
      const random = Math.random();
      const hash = md5(md5(password + login) + random);
      socket.emit(this.MESSAGES.USER_LOGIN, { login, hash, random });
    }
  }

  render() {
    return (
      <div className="container__intro">
        <div className="auth">
          <div className="menu__auth">
          <h1>Authorization</h1>
            <div className="input__menu">
              <input className='input__login' id="loginAuth" placeholder="Login" />
              <input type="password" className='input__password' id="passwordAuth" placeholder="Password"  />
            </div>  
            <div className="button__menu">
              <a href="#a" className="button__sign__in button" id="userLogin" onClick = {() => this.auth()}>Sign in</a>
              <a href="#a" className="button__sign__up button" id="userRegistr" onClick = { () => this.setRegistrState(true) }>Sign up</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;