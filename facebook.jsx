'use strict'

var React = require('react');

module.exports = React.createClass({

    render: function() {
      return (
        <div>
          <button
            className={ this.props.class ? this.props.class : 'facebook-login'}
            onClick={ this.handleClick }>
              { this.props.callToAction ? this.props.callToAction : "Login with Facebook"}
          </button>
          <div id="fb-root"></div>
        </div>
      )
    },

    componentDidMount: function() {

      window.fbAsyncInit = function() {
        FB.init({
          appId      : this.props.appId || '',
          xfbml      : this.props.xfbml || false,
          version    : 'v2.3'
        });

        if ( this.props.autoLoad ) {

          FB.getLoginStatus(function(response) {
            this.checkLoginState(response);
          }.bind(this));

        }

      }.bind(this);

      // Load the SDK asynchronously
      (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/pt_BR/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
    },

    responseApi: function( authResponse ) {
      FB.api('/me', function(response) {

        response.status = true;
        response.accessToken = authResponse.accessToken;
        response.expiresIn = authResponse.expiresIn;
        response.signedRequest = authResponse.signedRequest;

        if ( this.props.loginHandler ) {
          this.props.loginHandler( response );
        }


      }.bind(this));
    },

    checkLoginState: function(response) {
      if (response.authResponse) {

        this.responseApi(response.authResponse);

      } else {

        if ( this.props.loginHandler ) {
          this.props.loginHandler( { status: false } );
        }

      }
    },

    handleClick: function() {
      var valueScope = this.props.scope || 'public_profile, email, user_birthday';

      FB.login(this.checkLoginState, { scope: valueScope });
    }
});
