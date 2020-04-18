import React from 'react';
import './Game.scss';
import './../../index.css';

import socket from '../../helpers/socket';
import Canvas from '../modules/Canvas';
import Config from './config';

class Game extends React.Component {
  constructor(props) {
    super();
    this.MESSAGES = props.MESSAGES;
    this.COMMANDS = Config.COMMANDS;
    // колбеки
    this.setGameState = props.setGameState;
    this.state = {
      messages: [],
      imageStatus: 'loading',
      refresh: true
    };
    this.SPRITES = {
      SAILOR: new window.Image(),
      CAPTAIN: new window.Image(),

      GENERATOR: new window.Image(),
      SERVER: new window.Image(),
      TOILET: new window.Image(),
      COMP: new window.Image(),
      BED: new window.Image(),
      ROCKET_CLASP: new window.Image(),
      FRAME: new window.Image(),

      DOOR_CLOSE_L: new window.Image(),
      DOOR_CLOSE_R: new window.Image(),
      DOOR_OPEN_L: new window.Image(),
      DOOR_OPEN_R: new window.Image(),

      LAMP: new window.Image(),
      ROCKET: new window.Image()
    };
    this.toDraw = [];
    
    this.SPRITES.SAILOR.src = require('./../../assets/img/characters/big_man.png');
    this.SPRITES.CAPTAIN.src = require('./../../assets/img/characters/big_man2.png');

    this.SPRITES.GENERATOR.src = require('./../../assets/img/equipment/Generator.png');
    this.SPRITES.SERVER.src = require('./../../assets/img/equipment/Server.png');
    this.SPRITES.TOILET.src = require('./../../assets/img/equipment/Toilet.png');
    this.SPRITES.COMP.src = require('./../../assets/img/equipment/Comp.png');
    this.SPRITES.BED.src = require('./../../assets/img/equipment/Bed.png');
    this.SPRITES.ROCKET_CLASP.src = require('./../../assets/img/equipment/Rocket_clasp_A.png');
    this.SPRITES.FRAME.src = require('./../../assets/img/rooms/Frame.png');

    this.SPRITES.DOOR_CLOSE_L.src = require('./../../assets/img/equipment/Door_close_L.png');
    this.SPRITES.DOOR_CLOSE_R.src = require('./../../assets/img/equipment/Door_close_R.png');
    this.SPRITES.DOOR_OPEN_L.src = require('./../../assets/img/equipment/Door_open_L.png');
    this.SPRITES.DOOR_OPEN_R.src = require('./../../assets/img/equipment/Door_open_R.png');

    this.SPRITES.DOOR_OPEN_R.src = require('./../../assets/img/equipment/Lamp.png');
    this.SPRITES.DOOR_OPEN_R.src = require('./../../assets/img/equipment/Rocket.png');

    //this.setOnloadImages(); // повесить onload на картинки (теперь не нужно)

    socket.on(this.MESSAGES.NEW_MESSAGE, data => { this.newMessage(data) });
    socket.on(this.MESSAGES.START_GAME, data => console.log(data));
    socket.on(this.MESSAGES.UPDATE_SCENE, data => this.updateScene(data));
  }

  setOnloadImages() {
    for(let key in this.SPRITES) {
      this.SPRITES[key].onload = () => {
        this.setState({ imageStatus: 'loaded' });
      }
      this.SPRITES[key].onerror = () => {
        this.setState({ imageStatus: 'error' });
      }
    }
  }

  componentDidMount() {
    this.canvas = new Canvas({
      id: 'canvas'
    });
  }

  componentDidUpdate() {
    /* Здесь картинки уже подгружены */
    for(let i = 0; i < this.toDraw.length; i++) {
      let image = this.toDraw[i];
      this.canvas.drawImageScale(image.img, image.x, image.y, 100, 100);
    }
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
      this.state.messages.map(message => <div><b>{ message.name }</b> : { message.message }</div>)
    );
  }

  startGame() {
    let token = localStorage.getItem('token');
    socket.emit(this.MESSAGES.START_GAME, { token });
  }

  updateScene(data) {
    const { submarines } = data;
    for(let key in submarines) {
      for(let i = 0; i < submarines[key].compartments.length; i++) {
        // рисуем пустую комнату
        let compartment = submarines[key].compartments[i];
        for(let j = 0; j < compartment.length; j++) {
          this.toDraw.push({ img: this.SPRITES.FRAME, x: compartment.x*100 + 100*j, y: compartment.y*100 });
        }
        // заполняем оборудованием
        for(let j = 0; j < compartment.equipments.length; j++) {
          let equipment = compartment.equipments[j];
          this.toDraw.push({ img: this.SPRITES.GENERATOR, x: compartment.x*100 + equipment.position*100, y: compartment.y*100 });
        }
      }
    }
    this.setState({ refresh: true });
  }

  render() {
    return (
      <div className='main__container'>
        <div className='chat__container'>
          <input id="message" placeholder="Message"/>
          <button id="newMessage" onClick = { () => this.sendMessage() }>Send</button>
          <div id="chat"> { this.renderMessages() }</div>
        </div>
        <div className='game__container'>
          <canvas id='canvas'></canvas>
          <a href="#a" className="button" id="startGame" onClick = { () => this.startGame() }>Start Game</a>
        </div>
      </div>
    );
  }
}

export default Game;