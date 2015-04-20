#react-facebook-login

##Using react-facebook-login
```JS
var MyComponent = React.createClass({

  resultFacebookLogin: function( user ) {
    console.log( user );
    /*
      {
        status: true,
        signedRequest: "bAo8Ls7CYNKrr-3IkhBolY1eGvSU_5EBxcpFv6SDcMs.eyJhb...",
        accessToken: "CAAPeEvT9YHgBAL2VP82T0n2QIzcZCS11npiqfbipo7CZCg4DIz...",
        birthday: "10/12/1989",
        email: "keppelen.as....",
        expiresIn: 4275,
        first_name: "Giovanni",
        gender: "male",
        id: "10203478808561969",
        last_name: "Keppelen",
        link: "https://www.facebook.com/app_scoped_user_id/10203478808561969/",
        locale: "en_US",
        name: "Giovanni Keppelen",
        timezone: -3,
        updated_time: "2015-04-17T18:52:18+0000",
        verified: true
      }
    */
  },

  render: function() {
    return (
      <FacebookLogin
        appId="1088597931155576"
        xfbml="false"
        scope="public_profile, email, user_birthday"
        loginHandler={ this.resultFacebookLogin } />
    );
  }
});

React.render(
  <MyComponent />,
  document.getElementById('facebook')
);
```
