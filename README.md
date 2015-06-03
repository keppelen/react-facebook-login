#React Facebook Login

> An Component React for Facebook Login

##Install dependences
``` npm install react ```
``` npm install react-facebook-login --save ```

## How to use
```JAVASCRIPT
'use strict'

var React = require('react'),
    Facebook = require('react-facebook-login');

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

```

```HTML

<!DOCTYPE html>
<html>
<head>
    <title>Example React Facebook Login</title>
</head>
<body>
    <div id="facebook-login"></div>
</body>
</html>

```

##Parameters
|    params    |   value  |             default value            |
|:------------:|:--------:|:------------------------------------:|
|     appId    |  string  |                  ""                  |
|     class    |  string  |            facebook-login            |
|     scope    |  string  | public_profile, email, user_birthday |
| loginHandler | function |          resultFacebookLogin         |
|   autoLoad   |  boolean |                 false                |
|     xfbml    |  boolean |                 false                |
| callToAction |  string  |          Login with Facebook         |
