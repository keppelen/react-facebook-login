# React Facebook Login

> An Component React for Facebook Login

## Install dependences
```shell
npm install react --save
npm install react-dom --save
```

```shell
npm install react-facebook-login --save
```

## How to use

### Client
```js
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
  console.log(response);
}

ReactDOM.render(
  <FacebookLogin
    appId="1088597931155576"
    autoLoad={true}
    callback={responseFacebook} />,
  document.getElementById('demo')
);
```

### Server
```js
'use strict';

import React from 'react';
import FacebookLogin from 'react-facebook-login';

class MyComponent extends React.Component {
  constructor(props) {
      super(props);
  };

  responseFacebook = (response) => {
    console.log(response);
  };

  render() {
    return (
      <FacebookLogin
        appId="1088597931155576"
        autoLoad={true}
        callback={responseFacebook} />
    )
  }
}

export default MyComponent;
```


## Parameters

|    params    |   value  |             default value            |
|:------------:|:--------:|:------------------------------------:|
|     appId    |  string  |              Required                |
|     size     |  string  |        small - medium - metro        |
|     scope    |  string  | public_profile, email, user_birthday |
|   callback   | function |          resultFacebookLogin         |
|   autoLoad   |  boolean |                 false                |
|     xfbml    |  boolean |                 false                |
|   textButton |  string  |          Login Facebook              |
