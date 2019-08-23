/**
 * Extract the value for a given key in a url-encoded parameter string
 *
 * @param      {String} paramString The encoded parameter string
 * @param      {String} key The target key
 * @return     {Object} Decoded value for given parameter key
 */

export default (paramString, key) => {
  return decodeURIComponent(
    paramString.replace(
      new RegExp(
        '^(?:.*[&\\?]' +
        encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') +
        '(?:\\=([^&]*))?)?.*$', 'i'
      ),
      '$1'
    )
  );
};
