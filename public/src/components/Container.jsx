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
            auth: true,
            registr: false,
            game: false,
            teams: {}
        };
    }

    setTeams(data) {
        this.setState({ teams: data });
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
                            setAuthState = {(val) => this.setAuthState(val)}
                            setTeams = { (data) => this.setTeams(data)}/> :
                        this.state.game ? 
                            <Game
                                setGameState = { (val) => this.setGameState(val) }
                                MESSAGES = { CONFIG.MESSAGES }/> :
                            <Team
                                MESSAGES = { CONFIG.MESSAGES }
                                setTeams = { (teams) => this.setTeams(teams) }
                                setUpdate = { (val) => this.setUpdate(val) }
                                teams = { this.state.teams }
                                setGameState = { (val) => this.setGameState(val) }
                                setAuthState = { (val) => this.setAuthState(val) }/>
                } 
            </div>
        );
    }
}

export default Container;