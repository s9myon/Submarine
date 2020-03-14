import React from 'react';

import Auth from './Auth';
import Game from './Game';
import CONFIG  from './../config';

class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            auth: false
        }
    }

    setAuthState(val) {
        this.setState({
            auth: val
        });
    }

    render() {
        return (
            <div className="App">
                { this.state.auth ? 
                    <Game MESSAGES = { CONFIG.MESSAGES } setAuthState = {(val) => this.setAuthState(val)}/> : 
                    <Auth MESSAGES = { CONFIG.MESSAGES } setAuthState = {(val) => this.setAuthState(val)}/> }
            </div>
        );
    }
}

export default Container;