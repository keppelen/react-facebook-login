# React Facebook Auth - [![Build Status](https://travis-ci.org/silver-xu/react-facebook-authenticate.svg?branch=master)](https://travis-ci.org/keppelen/react-facebook-login)

> A Component React for Facebook Login & Logout

## Getting Started

- `yarn add react-facebook-authenticate` or `npm install react-facebook-authenticatecode`
- Your application will also need `react-dom` and `react` installed.

## Development

```shell
git clone https://github.com/silver-xu/react-facebook-authenticate.git && cd react-facebook-authenticate
npm install react react-dom react-facebook-authenticate --save --force
npm start
```

- navigate to [localhost:8080](http://localhost:8080)

## How to use

```js
import React from 'react';
import ReactDOM from 'react-dom';
import FacebookAuth from 'react-facebook-authenticate';

const responseFacebook = response => {
  console.log(response);
};

ReactDOM.render(
  <FacebookAuth
    appId="YOUR_APP_ID"
    autoLoad
    callback={responseFacebook}
    loginJSX={<button>This is my custom FB Login button</button>}
    logoutJSX={<button>This is my custom FB Logout button</button>}
  />,
  document.getElementById('demo'),
);
```

### Custom permission

By default the component, request only 'public_profile' permission, you can change if you send 'scope', that is a string comma separated attribute.

see https://developers.facebook.com/docs/facebook-login/permissions for permissions list

```js
import React from 'react';
import { FacebookAuth } from 'react-facebook-authenticate';

class MyComponent extends React.Component {
  responseFacebook(response) {
    console.log(response);
  }

  render() {
    return (
      <FacebookAuth
        appId="YOUR_APP_ID"
        autoLoad
        fields="name,email,picture"
        scope="public_profile,user_friends,user_actions.books"
        callback={responseFacebook}
        loginJSX={<button>This is my custom FB Login button</button>}
        logoutJSX={<button>This is my custom FB Logout button</button>}
      />
    );
  }
}

export default MyComponent;
```

## Parameters

|    params    |   value   |                                                                                                default value                                                                                                |
| :----------: | :-------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    appId     |  string   |                                                                                                  Required                                                                                                   |
|     size     |  string   |                                                                                           small - medium - metro                                                                                            |
|    scope     |  string   |                                                                                    public_profile, email, user_birthday                                                                                     |
|    fields    |  string   |                                                                                             name,email,picture                                                                                              |
|   callback   | function  |                                                                                             resultFacebookLogin                                                                                             |
| returnScopes |  boolean  |                                                                                                    false                                                                                                    |
|   autoLoad   |  boolean  |                                                                                                    false                                                                                                    |
|    xfbml     |  boolean  |                                                                                                    false                                                                                                    |
|    cookie    |  boolean  |                                                                                                    false                                                                                                    |
|   version    |  string   |                                                                                                     3.1                                                                                                     |
|     icon     |  string   |                                                                                                   element                                                                                                   | none |
|   language   |  string   |                                                                                                    en_US                                                                                                    |
|              |
|  isDisabled  |  boolean  |                                                                                                  undefined                                                                                                  |
|     tag      |  string   |                                                                                       HTML Element, Ex: 'a', 'button'                                                                                       |
|  onFailure   | function  |                                                                               optional function to separatere the failed init                                                                               |
|    state     |  string   | optional string to maintain state between the request and callback. This parameter should be used for preventing Cross-site Request Forgery and will be passed back to you, unchanged, in your redirect URI |
|   authType   |  string   |                                                                                optional string to change authentication type                                                                                |
| responseType |  string   |                                                                      optional string to change response type. Default value is 'code'                                                                       |
|   loginJSX   | ReactNode |                                                                                  The content to show while user logged in                                                                                   |
|  logoutJSX   | ReactNode |                                                                                  The content to show while user logged out                                                                                  |
