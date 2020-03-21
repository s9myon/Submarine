import React from 'react';
import './Game.scss';
import './../../index.css';

import socket from '../../helpers/socket';

class Game extends React.Component {
  constructor(props) {
    super();
    this.MESSAGES = props.MESSAGES;
    this.setAuthState = props.setAuthState;
    this.setGameState = props.setGameState;
    this.state = {
      messages: []
    };
    socket.on(this.MESSAGES.NEW_MESSAGE, (data) => {this.newMessage(data); console.log(data);});
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

  renderMessages() {
    return (
      this.state.messages.map(mess => <div><b>{ mess.name }</b> : { mess.message }</div>)
    );
  }

  render() {
    return (
      <div>
        <div>
        <input id="message" placeholder="Message"/>
        <button id="newMessage" onClick = {() => this.sendMessage()}>Send</button>
        <div id="chat"> { this.renderMessages() }</div>
        </div>
        <br/>
        <button id="back" onClick = { () => this.setGameState(false) }>Back</button>
      </div>
    );
  }
}

export default Game;