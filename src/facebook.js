import React, { PropTypes } from 'react';
import styles from '../styles/facebook.scss';

class FacebookLogin extends React.Component {

  static propTypes = {
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    scope: PropTypes.string,
    textButton: PropTypes.string,
    autoLoad: PropTypes.bool,
    size: PropTypes.string,
  };

  static defaultProps = {
    textButton: 'Login with Facebook',
    scope: 'public_profile, email, user_birthday',
    xfbml: false,
    size: 'medium',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.fbAsyncInit = () => {
      FB.init({
        appId: this.props.appId,
        xfbml: this.props.xfbml,
        version: 'v2.3',
      });

      if (this.props.autoLoad) {
        FB.getLoginStatus(this.checkLoginState);
      }
    };

    // Load the SDK asynchronously
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  responseApi = (authResponse) => {
    FB.api('/me', (me) => {
      me.accessToken = authResponse.accessToken;
      this.props.callback(me);
    });
  };

  checkLoginState = (response) => {
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else {
      if (this.props.callback) {
        this.props.callback({ status: response.status });
      }
    }
  };

  click = () => {
    FB.login(this.checkLoginState, { scope: this.props.scope });
  };

  render() {
    return (
      <div>
        <button className={this.props.size} onClick={this.click}>
            {this.props.textButton}
        </button>
        <style dangerouslySetInnerHTML={{ __html: styles }}></style>
        <div id="fb-root"></div>
      </div>
    );
  }
}

export default FacebookLogin;
