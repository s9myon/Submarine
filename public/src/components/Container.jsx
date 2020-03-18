import React from 'react';

import Auth from './Auth';
import Team from './Team';
import CONFIG  from './../config';

class Container extends React.Component {
    constructor() {
        super();
        this.state = {
            auth: true
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
                    <Team MESSAGES = { CONFIG.MESSAGES } setAuthState = {(val) => this.setAuthState(val)}/> : 
                    <Auth MESSAGES = { CONFIG.MESSAGES } setAuthState = {(val) => this.setAuthState(val)}/> }
            </div>
        );
    }
}

export default Container;