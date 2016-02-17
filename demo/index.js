'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from '../src/facebook';

const responseFacebook = (response) => {
  console.log(response);
}

ReactDOM.render(
  <FacebookLogin
    appId="1088597931155576"
    autoLoad={true}
    callback={responseFacebook}
    cssClass="my-facebook-button-class"
    icon="fa-facebook" />,
  document.getElementById('demo')
);
