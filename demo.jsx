'use strict'

var React = require('react'),
    Facebook = require('./facebook');

// Result response Facebook Login
var resultFacebookLogin = function( response ) {
  console.log( response );
}

React.render(
  <Facebook
        appId="1088597931155576"
        class="facebook-login"
        scope="public_profile, email, user_birthday"
        loginHandler={ resultFacebookLogin } />,

  document.getElementById('facebook-login'))
