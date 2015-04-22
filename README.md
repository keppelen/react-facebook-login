#react-facebook-login

##Using
```JS
var MyComponent = React.createClass({

  render: function() {
    return (
      <FacebookLogin
        appId="1088597931155576"
        xfbml="false"
        callToAction="Login com Facebook"
        class="facebook-login"
        scope="public_profile, email, user_birthday"
        loginHandler={ this.resultFacebookLogin } />
    );
  },

  resultFacebookLogin: function( user ) {
    console.log( user );
    /*
      {
        status: true,
        signedRequest: "bAo8Ls7CYNKrr-3IkhBolY1eGvSU_5EBxcpFv6SDcMs.eyJhb...",
        accessToken: "CAAPeEvT9YHgBAL2VP82T0n2QIzcZCS11npiqfbipo7CZCg4DIz...",
        expiresIn: 4275,
        birthday: "10/12/1989",
        email: "keppelen.as....",
        first_name: "Giovanni",
        gender: "male",
        id: "10203478808561969",
        last_name: "Keppelen",
        link: "https://www.facebook.com/app_scoped_user_id/10203478808561969/",
        locale: "en_US",
        name: "Giovanni Keppelen",
      }
    */
  }
});

React.render(
  <MyComponent />,
  document.getElementById('facebook')
);
```
