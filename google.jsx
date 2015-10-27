'use strict'

var React = require('react');
require('./css/style.css');

module.exports = React.createClass({

    render: function() {
      return (
        <div>
          <button className={ this.props.class ? this.props.class : 'google-login'} onClick={ this.handleClick }>
              { this.props.callToAction ? this.props.callToAction : "Google Login"}
          </button>
          <div id="fb-root"></div>
        </div>
      )
    },

    componentDidMount: function() {

      window.googleAsyncInit = function() {


        var clientID = this.props.clientID;
        var apiKey = this.props.apiKey; 
        var scopes = this.props.scopes; 



      }.bind(this);

      // Load the SDK asynchronously
      (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//apis.google.com/js/client.js?&output=embed"
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'google-platform'));
    },

    onSignInCallback: function(resp){
      gapi.client.load('plus', 'v1', apiClientLoaded);
    },

    apiClientLoaded: function(){
      gapi.client.plus.people.get({userId: 'me'}).execute(this.handleLoginResponse).bind(this);
    }, 

    handleLoginResponse: function(input){
      console.log(input)

      this.props.loginHandler({token: this.token, dataResponse: input});
      //call back into app 
    },


    handleClick: function() {

          var config = {
          'immediate': false,
          'client_id': this.props.clientID,
          'output': 'embed', 
          'scope': this.props.scope || 'https://www.googleapis.com/auth/plus.me',
        };
        gapi.auth.authorize(config, function() {
          console.log('login complete');
          var token = gapi.auth.getToken(); 
          console.log(token);
          this.token = token;
          this.onSignInCallback(token) 
        });
    }


});
