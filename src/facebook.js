import React from 'react';
import PropTypes from 'prop-types';
import decodeParamForKey from './decodeParam';

class FacebookAuth extends React.Component {
  static propTypes = {
    isDisabled: PropTypes.bool,
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    authType: PropTypes.string,
    scope: PropTypes.string,
    state: PropTypes.string,
    responseType: PropTypes.string,
    returnScopes: PropTypes.bool,
    redirectUri: PropTypes.string,
    autoLoad: PropTypes.bool,
    fields: PropTypes.string,
    version: PropTypes.string,
    language: PropTypes.string,
    onFailure: PropTypes.func,
    loginJSX: PropTypes.node.isRequired,
    logoutJSX: PropTypes.node.isRequired,
  };

  static defaultProps = {
    redirectUri: typeof window !== 'undefined' ? window.location.href : '/',
    scope: 'public_profile,email',
    returnScopes: false,
    xfbml: false,
    cookie: false,
    authType: '',
    fields: 'name',
    version: '3.1',
    language: 'en_US',
    disableMobileRedirect: false,
    onFailure: null,
    state: 'facebookdirect',
    responseType: 'code',
  };

  constructor(props) {
    super(props);

    this.state = {
      isSdkLoaded: false,
      isProcessing: false,
      isLoggedIn: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
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
  componentWillReceiveProps(nextProps) {
    if (this.state.isSdkLoaded && nextProps.autoLoad && !this.props.autoLoad) {
      window.FB.getLoginStatus(this.checkLoginAfterRefresh);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setStateIfMounted(state) {
    if (this._isMounted) {
      this.setState(state);
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
      this.setStateIfMounted({ isSdkLoaded: true });
      if (autoLoad || this.isRedirectedFromFb()) {
        window.FB.getLoginStatus(this.checkLoginAfterRefresh);
      }
    };
  }

  isRedirectedFromFb() {
    const params = window.location.search;
    return (
      decodeParamForKey(params, 'code') ||
      decodeParamForKey(params, 'granted_scopes')
    );
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
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = `https://connect.facebook.net/${language}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  responseApi = authResponse => {
    window.FB.api(
      '/me',
      { locale: this.props.language, fields: this.props.fields },
      me => {
        Object.assign(me, authResponse);
        this.props.callback(me);
      },
    );
  };

  checkLoginState = response => {
    let isLoggedIn = false;
    if (response.authResponse) {
      this.responseApi(response.authResponse);
      isLoggedIn = true;
    } else {
      if (this.props.onFailure) {
        this.props.onFailure({ status: response.status });
      } else {
        this.props.callback({ status: response.status });
      }
    }

    this.setState({ isProcessing: false, isLoggedIn });
  };

  checkoutLogoutState = response => {
    let isLoggedIn = true;

    if (response.authResponse) {
      isLoggedIn = false;
    } else {
      if (this.props.onFailure) {
        this.props.onFailure({ status: response.status });
      } else {
        this.props.callback({ status: response.status });
      }
    }

    this.setState({ isProcessing: false, isLoggedIn });
  };

  checkLoginAfterRefresh = response => {
    if (response.status === 'connected') {
      this.checkLoginState(response);
    } else {
      window.FB.login(
        loginResponse => this.checkLoginState(loginResponse),
        true,
      );
    }
  };

  handleLoginClick = e => {
    if (
      !this.state.isSdkLoaded ||
      this.state.isProcessing ||
      this.props.isDisabled
    ) {
      return;
    }
    this.setState({ isProcessing: true });

    const { scope, onLoginClick, returnScopes, authType } = this.props;

    if (!window.FB) {
      if (this.props.onFailure) {
        this.props.onFailure({ status: 'facebookNotLoaded' });
      }

      return;
    }

    window.FB.login(this.checkLoginState, {
      scope,
      return_scopes: returnScopes,
      auth_type: authType,
    });
  };

  handleLogoutClick = e => {
    if (
      !this.state.isSdkLoaded ||
      this.state.isProcessing ||
      this.props.isDisabled
    ) {
      return;
    }

    this.setState({ isProcessing: true });

    if (!window.FB) {
      if (this.props.onFailure) {
        this.props.onFailure({ status: 'facebookNotLoaded' });
      }

      return;
    }

    window.FB.logout(this.checkoutLogoutState);
  };

  render() {
    const { loginJSX, logoutJSX } = this.props;
    const { isLoggedIn } = this.state;

    if (!(loginJSX || logoutJSX)) {
      throw new Error('ReactFacebookLogin requires a render prop to render');
    }

    const propsForRender = {
      onLoginClick: this.handleLoginClick,
      onLogoutClick: this.handleLogoutClick,
      isDisabled: !!this.props.isDisabled,
      isProcessing: this.state.isProcessing,
      isSdkLoaded: this.state.isSdkLoaded,
    };

    return !isLoggedIn ? (
      <div onClick={propsForRender.onLoginClick}>{loginJSX}</div>
    ) : (
      <div onClick={propsForRender.onLogoutClick}>{logoutJSX}</div>
    );
  }
}

export default FacebookAuth;
