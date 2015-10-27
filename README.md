#React Google Login

> A Component React for Google Login

##Install dependences
``` npm install react ```
``` npm install react-Google-login --save ```

## How to use
```JAVASCRIPT
'use strict'

var React = require('react'),
    Google = require('react-Google-login');

// Result response Google Login
var resultGoogleLogin = function( response ) {
  console.log( response );
}

React.render(
  <Google
        appId="1088597931155576"
        class="Google-login"
        scope="public_profile, email, user_birthday"
        loginHandler={ resultGoogleLogin } />,

  document.getElementById('Google-login'))

```

```HTML

<!DOCTYPE html>
<html>
<head>
    <title>Example React Google Login</title>
</head>
<body>
    <div id="Google-login"></div>
</body>
</html>

```

##Parameters
|    params    |   value  |             default value            |
|:------------:|:--------:|:------------------------------------:|
|     appId    |  string  |                  ""                  |
|     class    |  string  |            Google-login            |
|     scope    |  string  | public_profile, email, user_birthday |
| loginHandler | function |          resultGoogleLogin         |
|   autoLoad   |  boolean |                 false                |
|     xfbml    |  boolean |                 false                |
| callToAction |  string  |          Login with Google         |
