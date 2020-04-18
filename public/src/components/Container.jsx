import React from 'react';

import Auth from './Auth';
import Registr from './Registr';
import Team from './Team';
import Game from './Game';
import CONFIG  from './../config';

class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            auth: true, // если проходишь авторизацию
            registr: false, // если проходишь регистрацию
            game: false // если перешел в лобби
        };
    }

    setAuthState(val) {
        this.setState({
            auth: val
        });
    }
    
    setRegistrState(val) {
        this.setState({
          registr: val
        });
    }
    
    setGameState(val) {
        this.setState({ 
            game: val 
        });
    }

    render() {
        return (
            <div className="App">
                { this.state.registr ? 
                    <Registr 
                        MESSAGES = { CONFIG.MESSAGES } 
                        setRegistrState = { (val) => this.setRegistrState(val)}/> : 
                    this.state.auth ? 
                        <Auth 
                            MESSAGES = { CONFIG.MESSAGES } 
                            setRegistrState = {(val) => this.setRegistrState(val)}
                            setAuthState = {(val) => this.setAuthState(val)}/> :
                        this.state.game ? 
                            <Game
                                MESSAGES = { CONFIG.MESSAGES }
                                setGameState = { (val) => this.setGameState(val) }/> :
                            <Team
                                MESSAGES = { CONFIG.MESSAGES }
                                setUpdate = { (val) => this.setUpdate(val) }
                                setIsJoinedState = { val => this.setIsJoinedState(val) }
                                setGameState = { (val) => this.setGameState(val) }/>
                } 
            </div>
        );
    }
}

export default Container;