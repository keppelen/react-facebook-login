'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {FacebookLogin, FacebookLogout} from '../src/facebook';

var App = React.createClass({
  getInitialState: function() {
    return {
      logged_in: false
    };
  },
  render: function() {
    var button = this.state.logged_in ? <FacebookLogout callback={this.onLogout}/> :
      <FacebookLogin
      appId="1003641623050851"
      autoLoad={false}
      callback={this.onLogin}
      icon="fa-facebook" />;
    return (
      <div>{button}</div>
    );
  },
  onLogout: function (){
    this.setState({ logged_in: false });
  },
  onLogin: function (){
    this.setState({ logged_in: true });
  }
});

ReactDOM.render(<App />, document.getElementById('demo'));