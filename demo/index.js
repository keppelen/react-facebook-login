import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Link} from 'react-router-dom'
import FacebookLogin from '../src/facebook';
import FacebookLoginWithButton from '../src/facebook-with-button';

const responseFacebook = (response) => {
  console.log(response);
};

const Base = () => {

  return (
    <div>
      <Link to="/dummy">Route to dummy page</Link>

      <div>
        <p>Facebook login with default button and styling</p>
        <FacebookLoginWithButton
          appId="668219527577200"
          autoLoad
          callback={responseFacebook}
          icon="fa-facebook"
        />
      </div>

      <div>
        <p>Facebook login with render prop (and no styling provided out the box)</p>
        <FacebookLogin
          appId="668219527577200"
          autoLoad
          callback={responseFacebook}
          render={renderProps => (
            <button onClick={renderProps.onClick}>This is my custom FB button</button>
          )}
        />
      </div>
    </div>
  );
}

const Dummy = () => {

  return (
    <div>
      <Link to="/">Back</Link>
      <h1>
        This is just a dummy page to test the button<br/>
        <a href="https://github.com/keppelen/react-facebook-login/pull/76#issuecomment-262098946">
          survives back and forth routing
        </a>
      </h1>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('demo')
);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Base/>}/>
        <Route path="/dummy" element={<Dummy/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);
