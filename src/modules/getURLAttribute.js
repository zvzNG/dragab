// ====getURLAttribute=== \\
export default function (attribute) {
  let currentAttribute = '';
  if (window.location.search.indexOf(attribute) != -1) {
    const URLWithFind = window.location.search.replace('?', '').split('&');
    for (let i = 0; i < URLWithFind.length; i++) {
      const el = URLWithFind[i];
      if (el.indexOf(attribute) != -1) {
        if (i == 0) {
          currentAttribute = '?' + el;
        } else {
          currentAttribute = '&' + el;
        }
      }
    }
  }
  return currentAttribute;
}
