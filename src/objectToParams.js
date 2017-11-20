/**
 * Encode object to url parameters
 *
 * @param      {Object} paramsObj The object needs to encode as url parameters
 * @return     {String} Encoded url parameters
 */
export default params => '?' + Object.keys(params)
  .map(param => `${param}=${encodeURIComponent(params[param])}`)
  .join('&');
