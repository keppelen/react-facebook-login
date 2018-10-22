// @flow
import React from 'react';
import PropTypes from 'prop-types';
import getParamsFromObject from './objectToParams';
import decodeParamForKey from './decodeParam';

const getIsMobile = () => {
  let isMobile = false;

  try {
    isMobile = !!((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
  } catch (ex) {
    // continue regardless of error
  }

  return isMobile;
};

class FacebookLogin extends React.Component {

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
    disableMobileRedirect: PropTypes.bool,
    isMobile: PropTypes.bool,
    fields: PropTypes.string,
    version: PropTypes.string,
    language: PropTypes.string,
    onClick: PropTypes.func,
    onFailure: PropTypes.func,
    render: PropTypes.func.isRequired,
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
    isMobile: getIsMobile(),
    onFailure: null,
    state: 'facebookdirect',
    responseType: 'code',
  };

  state = {
    isSdkLoaded: false,
    isProcessing: false,
  };

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
    if (this.state.isSdkLoaded && nextProps.autoLoad && ! this.props.autoLoad) {
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
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = `https://connect.facebook.net/${language}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  responseApi = (authResponse) => {
    window.FB.api('/me', { locale: this.props.language, fields: this.props.fields }, (me) => {
      Object.assign(me, authResponse);
      this.props.callback(me);
    });
  };

  checkLoginState = (response) => {
    this.setStateIfMounted({ isProcessing: false });
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else {
      if (this.props.onFailure) {
        this.props.onFailure({ status: response.status });
      } else {
        this.props.callback({ status: response.status });
      }
    }
  };

  checkLoginAfterRefresh = (response) => {
    if (response.status === 'connected') {
      this.checkLoginState(response);
    } else {
      window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
    }
  };

  click = (e) => {
    if (!this.state.isSdkLoaded || this.state.isProcessing || this.props.isDisabled) {
      return;
    }
    this.setState({ isProcessing: true });
    const { scope, appId, onClick, returnScopes, responseType, redirectUri, disableMobileRedirect, authType, state } = this.props;

    if (typeof onClick === 'function') {
      onClick(e);
      if (e.defaultPrevented) {
        return;
      }
    }

    const params = {

      client_id: appId,
      redirect_uri: redirectUri,
      state,
      return_scopes: returnScopes,
      scope,
      response_type: responseType,
      auth_type: authType,
    };

    if (this.props.isMobile && !disableMobileRedirect) {
      window.location.href = `https://www.facebook.com/dialog/oauth${getParamsFromObject(params)}`;
    } else {
      if (!window.FB) {
        if (this.props.onFailure) {
          this.props.onFailure({ status: 'facebookNotLoaded' });
        }

        return;
      }

      window.FB.login(this.checkLoginState, { scope, return_scopes: returnScopes, auth_type: params.auth_type });
    }
  };

  render() {
    const { render } = this.props;

    if (!render) {
      throw new Error('ReactFacebookLogin requires a render prop to render');
    }

    const propsForRender = {
      onClick: this.click,
      isDisabled: !!this.props.isDisabled,
      isProcessing: this.state.isProcessing,
      isSdkLoaded: this.state.isSdkLoaded,
    };
    return this.props.render(propsForRender);
  }
}

export default FacebookLogin;
