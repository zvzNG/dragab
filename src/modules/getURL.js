import getURLAttribute from './getURLAttribute';

// ====getURL==== \\
export default function (params, urlParams = '') {
  let url = '';

  // console.log(params);

  if (urlParams) url += '&' + urlParams;

  if (getURLAttribute('find').split('=')[1])
    url += '&' + getURLAttribute('find').replace(/[&?]/, '');

  if (Object.keys(params)) {
    for (const name in params) {
      const value = params[name];

      if (typeof value === 'object') {
        let val = Object.keys(value);
        if (val.length) url += `&${name}=${val.toString()}`;
      } else {
        if (value) url += `&${name}=${value}`;
      }
    }
  }

  // console.log(url);

  if (url) {
    return url.replace('&', '?');
  } else {
    return (url = location.origin + location.pathname);
  }
}
