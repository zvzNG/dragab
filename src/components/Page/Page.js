import '../../scss/main';
import '../../modules/polyfills';

/**
 * Base class for all entry points
 */
export default class Page {
  constructor() {
    this.$body = document.querySelector('body');
    this.initNotCriticalResources();
    this.goTopBtn();
  }

  initNotCriticalResources() {
    this.$body.addEventListener('click', (e) => {
      const el = e.target;
      if (el.closest('a[href]')) {
        if (el.getAttribute('href')?.endsWith('.jpg') || el.getAttribute('href')?.endsWith('.png')) {
          e.preventDefault();
        }
      }
    });

    document.addEventListener('DOMContentLoaded', (e) => {
      import(/* webpackChunkName: 'notCritical' */ './notCritical.js');
    })
    // window.onload = () =>
    //   import(/* webpackChunkName: 'notCritical' */ './notCritical.js')
  }

  goTopBtn() {
    const btn = document.getElementById('go-top');

    if (btn) {
      window.addEventListener('scroll', setGoTop);

      function setGoTop() {
        if (window.pageYOffset < window.innerHeight / 4) {
          btn.classList.add('none');
        } else {
          btn.classList.remove('none');
        }
      }

      setGoTop();

      btn.addEventListener('click', (e) => {
        document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  goTop(el) {
    // document.body.scrollIntoView({
    //   behavior: 'smooth',
    //   lift: 0,
    //   top: '1000px',
    // });
    document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
