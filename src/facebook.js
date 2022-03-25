// @flow
import React, { useState, useEffect } from 'react';
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

function isRedirectedFromFb() {
  const params = window.location.search;
  return (
    decodeParamForKey(params, 'state') === 'facebookdirect' && (decodeParamForKey(params, 'code') ||
      decodeParamForKey(params, 'granted_scopes'))
  );
}

function loadSdkAsynchronously(language) {
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

export default function FacebookLogin({
  isDisabled,
  callback,
  appId,
  xfbml = false,
  cookie = false,
  authType = '',
  scope = 'public_profile,email',
  state = 'facebookdirect',
  responseType = 'code',
  returnScopes = false,
  redirectUri = typeof window !== 'undefined' ? window.location.href : '/',
  autoLoad,
  disableMobileRedirect = false,
  isMobile = getIsMobile(),
  fields = 'name',
  version = '3.1',
  language = 'en_US',
  onClick,
  onFailure = null,
  render,
}) {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  function setFbAsyncInit() {
    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${version}`,
        appId,
        xfbml,
        cookie,
      });
      setIsSdkLoaded(true);
      if (autoLoad || isRedirectedFromFb()) {
        window.FB.getLoginStatus(checkLoginAfterRefresh);
      }
    };
  }

  function componentWillReceiveProps(nextProps) {
    if (isSdkLoaded && nextProps.autoLoad && !autoLoad) {
      window.FB.getLoginStatus(checkLoginAfterRefresh);
    }
  }

  function responseApi(authResponse) {
    window.FB.api('/me', { locale: language, fields: fields }, (me) => {
      Object.assign(me, authResponse);
      callback(me);
    });
  };

  function checkLoginAfterRefresh(response) {
    if (response.status === 'connected') {
      checkLoginState(response);
    } else {
      window.FB.login(loginResponse => checkLoginState(loginResponse), true);
    }
  };

  function checkLoginState(response) {
    setIsProcessing(false);
    if (response.authResponse) {
      responseApi(response.authResponse);
    } else {
      if (onFailure) {
        onFailure({ status: response.status });
      } else {
        callback({ status: response.status });
      }
    }
  };

  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      setIsSdkLoaded(true);
      return;
    }
    setFbAsyncInit();
    loadSdkAsynchronously(language);
    let fbRoot = document.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }
  }, []);

  function click(e) {
    if (!isSdkLoaded || isProcessing || isDisabled) {
      return;
    }
    setIsProcessing(true);

    if (typeof onClick === 'function') {
      onClick(e);
      if (e.defaultPrevented) {
        setIsProcessing(false);
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

    if (isMobile && !disableMobileRedirect) {
      window.location.href = `https://www.facebook.com/dialog/oauth${getParamsFromObject(params)}`;
    } else {
      if (!window.FB) {
        if (onFailure) {
          onFailure({ status: 'facebookNotLoaded' });
        }

        return;
      }

      window.FB.getLoginStatus(response => {
        if (response.status === 'connected') {
          checkLoginState(response);
        } else {
          window.FB.login(checkLoginState, { scope, return_scopes: returnScopes, auth_type: params.auth_type });
        }
      });
    }
  };

  if (!render) {
    throw new Error('ReactFacebookLogin requires a render prop to render');
  }

  return render({
    onClick: click,
    isDisabled,
    isProcessing,
    isSdkLoaded,
  });
}

FacebookLogin.propTypes = {
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
