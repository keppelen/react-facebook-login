'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Encode object to url parameters
 *
 * @param      {Object} paramsObj The object needs to encode as url parameters
 * @return     {String} Encoded url parameters
 */
exports.default = function (paramsObj) {
  var str = '';
  for (var key in paramsObj) {
    if (str !== '') {
      str += '&';
    }
    str += key + '=' + encodeURIComponent(paramsObj[key]);
  }
  return str;
};