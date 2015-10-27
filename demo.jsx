'use strict'

var React = require('react'),
    GoogleLogin = require('./google');

// Result response Facebook Login
var resultGoogleLogin = function( response ) {
  console.log( response );
}

React.render(
  <GoogleLogin
        clientID="307320636222-s8l1hac3lt7nasg18jutf4qnpdetrth0.apps.googleusercontent.com"
        class="google-login"
        scope="public_profile, email, user_birthday"
        loginHandler={ resultGoogleLogin } />,

  document.getElementById('google-login'))
