// @flow
import React, { PropTypes } from 'react';
import styles from '../styles/facebook.scss';
import objectToParams from './objectToParams';

class FacebookLogin extends React.Component {

  static propTypes = {
    isDisabled: PropTypes.bool,
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    reAuthenticate: PropTypes.bool,
    scope: PropTypes.string,
    redirectUri: PropTypes.string,
    textButton: PropTypes.string,
    typeButton: PropTypes.string,
    autoLoad: PropTypes.bool,
    disableMobileRedirect: PropTypes.bool,
    size: PropTypes.string,
    fields: PropTypes.string,
    cssClass: PropTypes.string,
    version: PropTypes.string,
    icon: PropTypes.any,
    language: PropTypes.string,
    onClick: PropTypes.func,
    containerStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
  };

  static defaultProps = {
    textButton: 'Login with Facebook',
    typeButton: 'button',
    redirectUri: typeof window !== 'undefined' ? window.location.href : '/',
    scope: 'public_profile,email',
    xfbml: false,
    cookie: false,
    reAuthenticate: false,
    size: 'metro',
    fields: 'name',
    cssClass: 'kep-login-facebook',
    version: '2.3',
    language: 'en_US',
    disableMobileRedirect: false,
  };

  state = {
    isSdkLoaded: false,
    isProcessing: false,
  };

  componentDidMount() {
    if (document.getElementById('facebook-jssdk')) {
      this.sdkLoaded();
      return;
    }
    this.setFbAsyncInit();
    this.loadSdkAsynchronously();
    let fbRoot = document.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }
  }

  setFbAsyncInit() {
    const { appId, xfbml, cookie, version, autoLoad } = this.props;
    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${version}`,
        appId,
        xfbml,
        cookie,
      });
      this.setState({ isSdkLoaded: true });
      if (autoLoad || window.location.search.includes('facebookdirect')) {
        window.FB.getLoginStatus(this.checkLoginAfterRefresh);
      }
    };
  }

  sdkLoaded() {
    this.setState({ isSdkLoaded: true });
  }

  loadSdkAsynchronously() {
    const { language } = this.props;
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = `//connect.facebook.net/${language}/all.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  responseApi = (authResponse) => {
    window.FB.api('/me', { fields: this.props.fields }, (me) => {
      Object.assign(me, authResponse);
      this.props.callback(me);
    });
  };

  checkLoginAfterRefresh = (response) => {
    if (response.status === 'unknown') {
      window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
    }
  };

  checkLoginState = (response) => {
    this.setState({ isProcessing: false });
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else {
      if (this.props.callback) {
        this.props.callback({ status: response.status });
      }
    }
  };

  checkLoginAfterRefresh = (response) => {
    if (response.status === 'unknown') {
      window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
    } else {
      this.checkLoginState(response);
    }
  };

  click = () => {
    if (!this.state.isSdkLoaded || this.state.isProcessing || this.props.isDisabled) {
      return;
    }
    this.setState({ isProcessing: true });
    const { scope, appId, onClick, reAuthenticate, redirectUri, disableMobileRedirect } = this.props;

    if (typeof onClick === 'function') {
      onClick();
    }

    let isMobile = false;

    try {
      isMobile = ((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
    } catch (ex) {
      // continue regardless of error
    }

    const params = {
      client_id: appId,
      redirect_uri: redirectUri,
      state: 'facebookdirect',
      scope,
    };

    if (reAuthenticate) {
      params.auth_type = 'reauthenticate';
    }

    if (isMobile && !disableMobileRedirect) {
      window.location.href = `//www.facebook.com/dialog/oauth?${objectToParams(params)}`;
    } else {
      window.FB.login(this.checkLoginState, { scope, auth_type: params.auth_type });
    }
  };

  style() {
    const defaultCSS = this.constructor.defaultProps.cssClass;
    if (this.props.cssClass === defaultCSS) {
      return <style dangerouslySetInnerHTML={{ __html: styles }}></style>;
    }
    return false;
  }

  // [AdGo] 20.11.2016 - coult not get container class to work
  containerStyle() {
    const style = { transition: 'opacity 0.5s' };
    if (this.state.isProcessing || !this.state.isSdkLoaded || this.props.isDisabled) {
      style.opacity = 0.6;
    }
    return Object.assign(style, this.props.containerStyle);
  }

  render() {
    const { cssClass, size, icon, textButton, buttonStyle } = this.props;
    const isIconString = typeof icon === 'string';
    return (
      <span style={ this.containerStyle() }>
        {isIconString && (
          <link
            rel="stylesheet"
            href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
          />
        )}
        <button
          className={`${cssClass} ${size}`}
          style={ buttonStyle }
          onClick={this.click}
        >
          {icon && isIconString && (
            <i className={`fa ${icon}`}></i>
          )}
          {icon && !isIconString && icon}
          {textButton}
        </button>
        {this.style()}
      </span>
    );
  }
}

export default FacebookLogin;
