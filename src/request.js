/**
 * Runs the redux-bees api request.
 * The baseUrl can also be a function which is assessed at runtime.
 *
 * @param {String|Function} baseUrl
 * @param {String} path
 * @param {Object} options
 * @return {Promise}
 */

export default function request(baseUrl, path, options) {
  const url = (typeof baseUrl === 'function' ? baseUrl() : baseUrl) + path
  return fetch(url, options)
    .then((res) => {
      const headers = {};
      res.headers.forEach((value, name) => headers[name] = value);

      const response = {
        status: res.status,
        headers,
        url: res.url
      };

      if (res.status !== 204) {
        // 404 may encounter SyntaxError: Unexpected token < in JSON at position 0 
        try {
          return res.json().then(body => ({ ...response, body }));
        } catch(err) {
          return Promise.resolve(response);
        }
      }

      return Promise.resolve(response);
    })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }

      return Promise.reject(response);
    });
};

