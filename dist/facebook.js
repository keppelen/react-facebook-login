'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _facebook = require('../styles/facebook.scss');

var _facebook2 = _interopRequireDefault(_facebook);

var _objectToParams = require('./objectToParams');

var _objectToParams2 = _interopRequireDefault(_objectToParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getIsMobile = function getIsMobile() {
  var isMobile = false;

  try {
    isMobile = !!(window.navigator && window.navigator.standalone || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
  } catch (ex) {
    // continue regardless of error
  }

  return isMobile;
};

// https://www.w3.org/TR/html5/disabled-elements.html#disabled-elements
var _shouldAddDisabledProp = function _shouldAddDisabledProp(tag) {
  return ['button', 'input', 'select', 'textarea', 'optgroup', 'option', 'fieldset'].indexOf((tag + '').toLowerCase()) >= 0;
};

var FacebookLogin = function (_React$Component) {
  _inherits(FacebookLogin, _React$Component);

  function FacebookLogin() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FacebookLogin);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FacebookLogin.__proto__ || Object.getPrototypeOf(FacebookLogin)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isSdkLoaded: false,
      isProcessing: false
    }, _this.responseApi = function (authResponse) {
      window.FB.api('/me', { locale: _this.props.language, fields: _this.props.fields }, function (me) {
        _extends(me, authResponse);
        _this.props.callback(me);
      });
    }, _this.checkLoginState = function (response) {
      _this.setStateIfMounted({ isProcessing: false });
      if (response.authResponse) {
        _this.responseApi(response.authResponse);
      } else {
        if (_this.props.callback) {
          _this.props.callback({ status: response.status });
        }
      }
    }, _this.checkLoginAfterRefresh = function (response) {
      if (response.status === 'connected') {
        _this.checkLoginState(response);
      } else {
        window.FB.login(function (loginResponse) {
          return _this.checkLoginState(loginResponse);
        }, true);
      }
    }, _this.click = function (e) {
      if (!_this.state.isSdkLoaded || _this.state.isProcessing || _this.props.isDisabled) {
        return;
      }
      _this.setState({ isProcessing: true });
      var _this$props = _this.props,
          scope = _this$props.scope,
          appId = _this$props.appId,
          onClick = _this$props.onClick,
          reAuthenticate = _this$props.reAuthenticate,
          redirectUri = _this$props.redirectUri,
          disableMobileRedirect = _this$props.disableMobileRedirect;


      if (typeof onClick === 'function') {
        onClick(e);
        if (e.defaultPrevented) {
          return;
        }
      }

      var params = {
        client_id: appId,
        redirect_uri: redirectUri,
        state: 'facebookdirect',
        scope: scope
      };

      if (reAuthenticate) {
        params.auth_type = 'reauthenticate';
      }

      if (_this.props.isMobile && !disableMobileRedirect) {
        window.location.href = '//www.facebook.com/dialog/oauth?' + (0, _objectToParams2.default)(params);
      } else {
        window.FB.login(_this.checkLoginState, { scope: scope, auth_type: params.auth_type });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FacebookLogin, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._isMounted = true;
      if (document.getElementById('facebook-jssdk')) {
        this.sdkLoaded();
        return;
      }
      this.setFbAsyncInit();
      this.loadSdkAsynchronously();
      var fbRoot = document.getElementById('fb-root');
      if (!fbRoot) {
        fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';
        document.body.appendChild(fbRoot);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
    }
  }, {
    key: 'setStateIfMounted',
    value: function setStateIfMounted(state) {
      if (this._isMounted) {
        this.setState(state);
      }
    }
  }, {
    key: 'setFbAsyncInit',
    value: function setFbAsyncInit() {
      var _this2 = this;

      var _props = this.props,
          appId = _props.appId,
          xfbml = _props.xfbml,
          cookie = _props.cookie,
          version = _props.version,
          autoLoad = _props.autoLoad;

      window.fbAsyncInit = function () {
        window.FB.init({
          version: 'v' + version,
          appId: appId,
          xfbml: xfbml,
          cookie: cookie
        });
        _this2.setStateIfMounted({ isSdkLoaded: true });
        if (autoLoad || window.location.search.includes('facebookdirect')) {
          window.FB.getLoginStatus(_this2.checkLoginAfterRefresh);
        }
      };
    }
  }, {
    key: 'sdkLoaded',
    value: function sdkLoaded() {
      this.setState({ isSdkLoaded: true });
    }
  }, {
    key: 'loadSdkAsynchronously',
    value: function loadSdkAsynchronously() {
      var language = this.props.language;

      (function (d, s, id) {
        var element = d.getElementsByTagName(s)[0];
        var fjs = element;
        var js = element;
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);js.id = id;
        js.src = '//connect.facebook.net/' + language + '/all.js';
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  }, {
    key: 'style',
    value: function style() {
      var defaultCSS = this.constructor.defaultProps.cssClass;
      if (this.props.cssClass === defaultCSS) {
        return _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: _facebook2.default } });
      }
      return false;
    }

    // [AdGo] 20.11.2016 - coult not get container class to work

  }, {
    key: 'containerStyle',
    value: function containerStyle() {
      var style = { transition: 'opacity 0.5s' };
      if (this.state.isProcessing || !this.state.isSdkLoaded || this.props.isDisabled) {
        style.opacity = 0.6;
      }
      return _extends(style, this.props.containerStyle);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          cssClass = _props2.cssClass,
          size = _props2.size,
          icon = _props2.icon,
          textButton = _props2.textButton,
          typeButton = _props2.typeButton,
          buttonStyle = _props2.buttonStyle;

      var isIconString = typeof icon === 'string';
      var optionalProps = {};
      if (this.props.isDisabled && _shouldAddDisabledProp(this.props.tag)) {
        optionalProps.disabled = true;
      }
      return _react2.default.createElement(
        'span',
        { style: this.containerStyle() },
        isIconString && _react2.default.createElement('link', {
          rel: 'stylesheet',
          href: '//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'
        }),
        _react2.default.createElement(
          this.props.tag,
          _extends({
            type: typeButton,
            className: cssClass + ' ' + size,
            style: buttonStyle,
            onClick: this.click
          }, optionalProps),
          icon && isIconString && _react2.default.createElement('i', { className: 'fa ' + icon }),
          icon && !isIconString && icon,
          textButton
        ),
        this.style()
      );
    }
  }]);

  return FacebookLogin;
}(_react2.default.Component);

FacebookLogin.propTypes = {
  isDisabled: _propTypes2.default.bool,
  callback: _propTypes2.default.func.isRequired,
  appId: _propTypes2.default.string.isRequired,
  xfbml: _propTypes2.default.bool,
  cookie: _propTypes2.default.bool,
  reAuthenticate: _propTypes2.default.bool,
  scope: _propTypes2.default.string,
  redirectUri: _propTypes2.default.string,
  textButton: _propTypes2.default.string,
  typeButton: _propTypes2.default.string,
  autoLoad: _propTypes2.default.bool,
  disableMobileRedirect: _propTypes2.default.bool,
  isMobile: _propTypes2.default.bool,
  size: _propTypes2.default.string,
  fields: _propTypes2.default.string,
  cssClass: _propTypes2.default.string,
  version: _propTypes2.default.string,
  icon: _propTypes2.default.any,
  language: _propTypes2.default.string,
  onClick: _propTypes2.default.func,
  containerStyle: _propTypes2.default.object,
  buttonStyle: _propTypes2.default.object,
  tag: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};
FacebookLogin.defaultProps = {
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
  isMobile: getIsMobile(),
  tag: 'button'
};
exports.default = FacebookLogin;