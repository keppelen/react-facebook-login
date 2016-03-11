import React, { PropTypes } from 'react';
import styles from '../styles/facebook.scss';

class FacebookLogin extends React.Component {

  static propTypes = {
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    scope: PropTypes.string,
    textButton: PropTypes.string,
    autoLoad: PropTypes.bool,
    size: PropTypes.string,
    fields: PropTypes.string,
    cssClass: PropTypes.string,
    version: PropTypes.string,
    icon: PropTypes.string,
    language: PropTypes.string,
  };

  static defaultProps = {
    textButton: 'Login with Facebook',
    scope: 'public_profile, email',
    xfbml: false,
    cookie: false,
    size: 'medium',
    fields: 'name',
    cssClass: 'kep-login-facebook kep-login-facebook-',
    version: '2.3',
    language: 'en_US',
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.fbAsyncInit = () => {
      FB.init({
        appId: this.props.appId,
        xfbml: this.props.xfbml,
        cookie: this.props.cookie,
        version: 'v' + this.props.version,
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
      js.src = '//connect.facebook.net/' + this.props.language + '/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  responseApi = (authResponse) => {
    FB.api('/me', { fields: this.props.fields }, (me) => {
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
    let innerButton = null;
    let buttonClass = null;

    if (this.props.cssClass !== 'kep-login-facebook kep-login-facebook-') {
      buttonClass = this.props.cssClass;
    } else {
      buttonClass = this.props.cssClass + this.props.size;
    }

    if (this.props.icon) {
      innerButton = '<i class="fa ' + this.props.icon + '"></i>';
      innerButton += this.props.textButton;
    } else {
      innerButton = this.props.textButton;
    }

    return (
      <div>
        <button
          className={buttonClass}
          onClick={this.click}
          dangerouslySetInnerHTML={{ __html: innerButton }}
        ></button>
        <style dangerouslySetInnerHTML={{ __html: styles }}></style>
        <div id="fb-root"></div>
      </div>
    );
  }
}

export default FacebookLogin;
