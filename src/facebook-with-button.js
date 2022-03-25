// @flow
import * as React from 'react'
import PropTypes from 'prop-types';
import styles from '../styles/facebook.scss';
import FacebookLogin from './facebook';

// https://www.w3.org/TR/html5/disabled-elements.html#disabled-elements
const _shouldAddDisabledProp = (tag) => [
  'button',
  'input',
  'select',
  'textarea',
  'optgroup',
  'option',
  'fieldset',
].indexOf((tag + '').toLowerCase()) >= 0;

export default function ReactFacebookLoginWithButton({
  textButton = 'Login with Facebook',
  typeButton = 'button',
  size = 'metro',
  cssClass = 'kep-login-facebook',
  icon,
  containerStyle,
  buttonStyle,
  fields = 'name',
  tag = 'button',
  ...props
}) {

  function style() {
    if (cssClass) {
      return <style dangerouslySetInnerHTML={{ __html: styles }}></style>;
    }
    return false;
  }

  function containerStyle(renderProps) {
    const { isProcessing, isSdkLoaded, isDisabled } = renderProps;

    const style = { transition: 'opacity 0.5s' };
    if (isProcessing || !isSdkLoaded || isDisabled) {
      style.opacity = 0.6;
    }
    return Object.assign(style, containerStyle);
  }

  function renderOwnButton(renderProps) {
    const { onClick, isDisabled } = renderProps;

    const isIconString = typeof icon === 'string';
    const optionalProps = {};

    if (isDisabled && _shouldAddDisabledProp(tag)) {
      optionalProps.disabled = true;
    }

    const Tag = tag;

    return (
      <span style={containerStyle(renderProps)}>
        {isIconString && (
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
          />
        )}
        <Tag
          type={typeButton}
          className={`${cssClass} ${size}`}
          style={buttonStyle}
          onClick={onClick}
          {...optionalProps}
        >
          {icon && isIconString && (
            <i className={`fa ${icon}`}></i>
          )}
          {icon && !isIconString && icon}
          {textButton}
        </Tag>
        {style()}
      </span>
    );
  }

  return (
    <FacebookLogin {...props} render={renderProps => renderOwnButton(renderProps)} />
  );
}

ReactFacebookLoginWithButton.propTypes = {
  textButton: PropTypes.string,
  typeButton: PropTypes.string,
  size: PropTypes.string,
  cssClass: PropTypes.string,
  icon: PropTypes.any,
  containerStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  fields: PropTypes.string,
  tag: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
