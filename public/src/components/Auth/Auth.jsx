import React from 'react';
import md5 from 'md5';
import './Auth.scss';
import './../../index.css';

import Registr from './../Registr';

import socket from '../../helpers/socket';

class Auth extends React.Component {
  constructor(props) {
    super();
    this.setAuthState = props.setAuthState;
    this.MESSAGES = props.MESSAGES;
    this.state = {
      registr: false
    }
    //public_old Внизу
    socket.on(this.MESSAGES.USER_LOGIN, data => {
      if(data.token) {
        localStorage.setItem('token', data.token);  
        this.setAuthState(true);
      }
    });
  }

  setRegistrState(val) {
    this.setState({
      registr: val
    });
  }

  //public_old функции сверху в onload
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
      { this.state.registr ? 
        <Registr MESSAGES = { this.MESSAGES } setRegistrState = { (val) => this.setRegistrState(val) }/> : 
        <div className="auth">
          
          <div className="menu__auth">
          <h1>Authorization</h1>
            <div className="input__menu">
            
              <input className='input__login' id="loginAuth" placeholder="Login" />
              <input type="password" className='input__password' id="passwordAuth" placeholder="Password"  />
            </div>  
            <div className="button__menu">
              <a className='button__sign__in' id='button' id="userLogin" onClick = {() => this.auth()}>Sign in</a>
              <a className="button__sign__up" id='button' id="userRegistr" onClick = { () => this.setRegistrState(true) }>Sign up</a>
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default Auth;