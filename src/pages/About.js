import Page from '../components/Page/Page';
import '../scss/pages/About/About';
// import '../modules/popup';
import slider from '../modules/slider';

import setSliderPagination from '../components/sliderPagination.js';

/**
 * About company page
 */
class Homepage extends Page {
  constructor() {
    super();

    this.initSlider();
    this.initAbout();
  }

  initAbout() {
    setSliderPagination('.slider_pagination', '.slide', this.sliderPopup);
  }

  initSlider() {
    this.sliderPopup = slider({
      container: '.slider_body',
      items: 1,
      slideBy: 'page',
      autoplay: false,
      nav: false,
      prevButton: '.prev_btn',
      nextButton: '.next_btn',
      // arrowKeys: true,
      lazyloadSelector: '.tns-lazy-img',
      lazyload: true,
      speed: 500,
    });
  }
}

new Homepage();
