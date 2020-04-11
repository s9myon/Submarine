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
            isJoined: false, // если присоединился к команде
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

    setIsJoinedState(val) {
        this.setState({
            isJoined: val
        });
    }
    
    setGameState(val) {
        this.setState(state => {
            return { game: val && state.isJoined };
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
                            setIsJoinedState = { val => this.setIsJoinedState(val) }
                            setTeams = { (data) => this.setTeams(data)}/> :
                        this.state.game ? 
                            <Game
                                setGameState = { (val) => this.setGameState(val) }
                                setIsJoinedState = { val => this.setIsJoinedState(val) }
                                MESSAGES = { CONFIG.MESSAGES }/> :
                            <Team
                                MESSAGES = { CONFIG.MESSAGES }
                                setTeams = { (teams) => this.setTeams(teams) }
                                setUpdate = { (val) => this.setUpdate(val) }
                                setIsJoinedState = { val => this.setIsJoinedState(val) }
                                setGameState = { (val) => this.setGameState(val) }
                                teams = { this.state.teams }/>
                } 
            </div>
        );
    }
}

export default Container;