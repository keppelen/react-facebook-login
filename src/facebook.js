// @flow
import { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import decodeParamForKey from './decodeParam'
import getParamsFromObject from './objectToParams'

const getIsMobile = () => {
  let isMobile = false

  try {
    isMobile = !!(
      (window.navigator && window.navigator.standalone) ||
      navigator.userAgent.match('CriOS') ||
      navigator.userAgent.match(/mobile/i)
    )
  } catch (ex) {
    // continue regardless of error
  }

  return isMobile
}

const FacebookLogin = ({
  autoLoad,
  appId,
  isDisabled,
  redirectUri = typeof window !== 'undefined' ? window.location.href : '/',
  callback,
  scope = 'public_profile,email',
  returnScopes = false,
  xfbml = false,
  cookie = false,
  authType = '',
  fields = 'name',
  version = '4.1',
  language = 'en_US',
  disableMobileRedirect = false,
  isMobile = getIsMobile(),
  render,
  onFailure = null,
  onClick,
  state = 'facebookdirect',
  responseType = 'code'
}) => {
  const [isSdkLoaded, setIsSdkLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  let isMounted = false

  useEffect(() => {
    isMounted = true
    if (document.getElementById('facebook-jssdk')) {
      setIsSdkLoaded(true)
      return
    }
    setFbAsyncInit()
    loadSdkAsynchronously()
    let fbRoot = document.getElementById('fb-root')
    if (!fbRoot) {
      fbRoot = document.createElement('div')
      fbRoot.id = 'fb-root'
      document.body.appendChild(fbRoot)
    }
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (isSdkLoaded && autoLoad) {
      window.FB.getLoginStatus(checkLoginAfterRefresh)
    }
  }, [isSdkLoaded, autoLoad])

  const setFbAsyncInit = () => {
    window.fbAsyncInit = () => {
      window.FB.init({
        version: `v${version}`,
        appId,
        xfbml,
        cookie
      })
      if (isMounted) {
        setIsSdkLoaded(true)
      }
      if (autoLoad || isRedirectedFromFb()) {
        window.FB.getLoginStatus(checkLoginAfterRefresh)
      }
    }
  }

  const isRedirectedFromFb = () => {
    const params = window.location.search
    return (
      decodeParamForKey(params, 'code') ||
      decodeParamForKey(params, 'granted_scopes')
    )
  }

  const loadSdkAsynchronously = () => {
    ;((d, s, id) => {
      const element = d.getElementsByTagName(s)[0]
      const fjs = element
      let js = element
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = `https://connect.facebook.net/${language}/sdk.js`
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }

  const responseApi = authResponse => {
    window.FB.api('/me', { locale: language, fields }, me => {
      Object.assign(me, authResponse)
      callback(me)
    })
  }

  const checkLoginState = response => {
    setIsProcessing(false)
    if (response.authResponse) {
      responseApi(response.authResponse)
    } else {
      if (onFailure) {
        onFailure({ status: response.status })
      } else {
        callback({ status: response.status })
      }
    }
  }

  const checkLoginAfterRefresh = response => {
    if (response.status === 'connected') {
      checkLoginState(response)
    } else {
      window.FB.login(loginResponse => checkLoginState(loginResponse), true)
    }
  }

  const click = e => {
    if (!isSdkLoaded || isProcessing || isDisabled) {
      return
    }
    setIsProcessing(true)

    if (typeof onClick === 'function') {
      onClick(e)
      if (e.defaultPrevented) {
        setIsProcessing(false)
        return
      }
    }

    const params = {
      client_id: appId,
      redirect_uri: redirectUri,
      state,
      return_scopes: returnScopes,
      scope,
      response_type: responseType,
      auth_type: authType
    }

    if (isMobile && !disableMobileRedirect) {
      window.location.href = `https://www.facebook.com/dialog/oauth${getParamsFromObject(
        params
      )}`
    } else {
      if (!window.FB) {
        if (onFailure) {
          onFailure({ status: 'facebookNotLoaded' })
        }

        return
      }

      window.FB.login(checkLoginState, {
        scope,
        return_scopes: returnScopes,
        auth_type: params.auth_type
      })
    }
  }

  if (!render) {
    throw new Error('ReactFacebookLogin requires a render prop to render')
  }

  const propsForRender = {
    onClick: click,
    isDisabled: !!isDisabled,
    isProcessing: isProcessing,
    isSdkLoaded: isSdkLoaded
  }
  return render(propsForRender)
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
  render: PropTypes.func.isRequired
}

export default FacebookLogin
