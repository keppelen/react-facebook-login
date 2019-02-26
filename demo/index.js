import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import { FacebookAuth } from '../src/facebook';

const responseFacebook = response => {
  console.log(response);
};

class Base extends Component {
  render() {
    return (
      <div>
        <Link to="/dummy">Route to dummy page</Link>

        <div>
          <p>
            Facebook login with render prop (and no styling provided out the
            box)
          </p>
          <FacebookAuth
            appId="332341234834470"
            autoLoad
            callback={responseFacebook}
            loginJSX={<button>This is my custom FB Login button</button>}
            logoutJSX={<button>This is my custom FB Logout button</button>}
          />
        </div>
      </div>
    );
  }
}

class Dummy extends Component {
  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h1>
          This is just a dummy page to test the button
          <br />
          <a href="https://github.com/keppelen/react-facebook-login/pull/76#issuecomment-262098946">
            survives back and forth routing
          </a>
        </h1>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Base} />
    <Route path="/dummy" component={Dummy} />
  </Router>,
  document.getElementById('demo'),
);
