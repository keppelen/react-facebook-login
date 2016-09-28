/**
 * Converts object to url parameters
 *
 * @param      {Object} paramsObj The object needs to convert in params
 * @return     {Object}  { description_of_the_return_value }
 */
export default paramsObj => {
  let str = '';
  for (let key in paramsObj) {
    if (str !== '') {
        str += '&';
    }
    str += `${key}=${encodeURIComponent(paramsObj[key])}`;
  }
  return str;
};
