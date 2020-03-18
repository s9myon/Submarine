import React from 'react';
import './Team.scss';
import './../../index.css';

import socket from '../../helpers/socket';

class Team extends React.Component {
  constructor(props) {
    super();
    this.MESSAGES = props.MESSAGES;
    this.setAuthState = props.setAuthState;
    this.state = {
      messages: []
    };
    socket.on(this.MESSAGES.NEW_MESSAGE, (data) => this.newMessage(data));
    socket.on(this.MESSAGES.TEAM_LIST, (data) => console.log(data));
    socket.on(this.MESSAGES.REMOVE_TEAM, (data) => console.log(data));
  }

  sendMessage() {
    const message = document.querySelector('#message').value;
    socket.emit(this.MESSAGES.NEW_MESSAGE, { token : localStorage.getItem('token'), message });
  }

  newMessage(data) {
    this.setState((state) => {
      let messages = state.messages;
      messages.push({
        message: data.message,
        name: data.name
      });
      return { messages }
    });
  }
  
  addToRoom() {
    const room = document.querySelector('#room').value;
    if(room) {
        socket.emit(this.MESSAGES.ADD_TO_ROOM, { token: localStorage.getItem('token'), room });
    }
  }

  renderMessages() {
    return (
      this.state.messages.map(mess => <div><b>{ mess.name }</b> : { mess.message }</div>)
    );
  }

  logout() {
    socket.emit(this.MESSAGES.USER_LOGOUT, { token : localStorage.getItem('token') });
    localStorage.removeItem('token');
    this.setAuthState(false);
  }

  createRoom() {
    socket.emit(this.MESSAGES.CREATE_TEAM, { 
      token: localStorage.getItem('token'),
      name: 'белая стрекоза'
    });
  }

  deleteRoom() {
    socket.emit(this.MESSAGES.REMOVE_TEAM, { 
      token: localStorage.getItem('token')
    });
  }

  render() {
    return (
      <div className="Team">
        <div className="main__menu">
          <a href="/" className="create__team__btn">Create Team</a>
          <a href="/" className="team__list__btn">Team List</a>
          <a href="" className="log__out">Log Out</a>
        </div>
        <div className="team__list">
          <h2>Team List</h2>
          <h3>Game name</h3>
          <div className="team__lobby">
            <p className="team__name">Trusov room</p>
            <a href="" className="join__team__btn">Join</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Team;