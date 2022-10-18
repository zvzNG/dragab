// import { tns } from '../libs/tiny-slider/src/tiny-slider.js';
import Page from '../components/Page/Page';
import '../modules/popup.js';
import '../scss/pages/Card/Card.scss';

import slider from '../modules/slider';
import client from '../modules/client';
import dropList from '../components/dropList';
import Form from '../modules/Form';
import initApplicability from '../modules/initApplicability';
import * as Mask from 'maska';
import setSliderPagination from '../components/sliderPagination.js';

/**
 * Card page
 * when Form submitted, we show success modal and block form for second submit
 */
class Card extends Page {
  constructor() {
    super();

    dropList('.oem-number_value');

    this.articles = document.querySelector('.card_body').dataset.articles;
    this.id = document.querySelector('.card_body').dataset.id;

    this.getOrder();
    // this.getApplicability();
    this.initCardSlider();
    this.initCertificateSlider();
    initApplicability();
    // this.initCardPopupSlider();
  }

  initCardSlider() {
    const container = document.querySelector('.card_slider');
    if (container) {
      this.cardSlider = slider({
        container: '.card_slider',
        items: 1,
        loop: false,
        autoplay: false,
        nav: true,
        navAsThumbnails: true,
        prevButton: '.slider_prev.card_btn',
        nextButton: '.slider_next.card_btn',
        navContainer: '.slider_pagination.card_pagination',
        // arrowKeys: true,
        speed: 500,
      });
      this.initSliderPagination();
    }
  }

  initSliderPagination() {
    const container = document.querySelector(
      '.slider_pagination.card_pagination'
    );
    if (container) {
      this.sliderPagination = slider({
        container: '.slider_pagination.card_pagination',
        items: 2,
        slideBy: 1,
        gutter: 20,
        // nav: false,
        loop: false,

        responsive: {
          450: {
            gutter: 25,
            items: 3,
          },
        },
        // prevButton: '.slider_prev.card_btn',
        // nextButton: '.slider_next.card_btn',
        // axis: 'vertical',
        autoplay: false,
        // arrowKeys: false,
        speed: 500,
      });
      this.sliderPaginationWork();
    }
  }

  sliderPaginationWork() {
    let sliderNavList = document.querySelectorAll('.slider_nav__item');
    const btnNext = document.querySelector('.slider_next.card_btn');
    const btnPrev = document.querySelector('.slider_prev.card_btn');
    // console.log(sliderNavList.length / 3);

    btnNext.addEventListener('click', (e) => {
      this.sliderPagination.goTo('next');
    });

    btnPrev.addEventListener('click', (e) => {
      this.sliderPagination.goTo('prev');
    });

    sliderNavList.forEach((item, i) => {
      item.addEventListener('mouseover', (e) => {
        // this.sliderPagination.goTo(i);
        this.cardSlider.goTo(i);
      });
    });
  }

  initCardPopupSlider() {
    let container = document.querySelector('.card_popup__slider');
    if (container) {
      this.cardPopupSlider = slider({
        container: '.card_popup__slider',
        items: 1,
        // slideBy: 'page',
        autoplay: false,
        nav: false,
        prevButton: '.prev_btn.card_btn',
        nextButton: '.next_btn.card_btn',
        // arrowKeys: false,
        lazyloadSelector: '.tns-lazy-img',
        lazyload: true,
        speed: 500,
      });

      setSliderPagination(
        '.slider_pagination.card_popup',
        '.popup_card__slide',
        this.cardPopupSlider
      );

      const slideLinks = document.querySelectorAll('.slide_link');

      for (let i = 0; i < slideLinks.length; i++) {
        const link = slideLinks[i];
        link.addEventListener('click', (e) => {
          // this.cardPopupSlider.goTo(i);
        });
      }
    }
  }

  initCertificateSlider() {
    let container = document.querySelector('.slider_body.popup_slider');
    if (container) {
      this.certificateSlider = slider({
        container: '.slider_body.popup_slider',
        items: 1,
        autoplay: false,
        prevButton: '.prev_btn.popup_content',
        nextButton: '.next_btn.popup_content',
        // arrowKeys: true,
        lazyloadSelector: '.tns-lazy-img',
        lazyload: true,
        speed: 500,
      });

      setSliderPagination(
        '.slider_pagination.popup_content',
        '.slider_body.popup_slider .slide',
        this.certificateSlider
      );
    }
  }

  applicabilityToggle() {
    const applicabilitys = document.querySelectorAll('.table_body tbody tr');

    if (applicabilitys.length > 11) {
      for (let i = 11; i < applicabilitys.length; i++) {
        const applicability = applicabilitys[i];
        applicability.classList.toggle('none');
      }
    } else {
      if (document.querySelector('.table_body~.show_btn'))
        document.querySelector('.table_body~.show_btn').classList.add('none');
    }
  }

  getOrder() {
    const _this = this;
    const orderBtn = document.querySelector('.order_btn');
    const container = document.querySelector('.menu_body.order .form_wrap');

    orderBtn.addEventListener('click', getOrderForm);

    function getOrderForm() {
      client('/api/order/?productId=' + _this.id)
        .then((res) => {
          container.innerHTML = res;
        })
        .finally(() => {
          container.classList.remove('load');
          _this.initForm();
          orderBtn.removeEventListener('click', getOrderForm);
        });
    }
  }

  getApplicability() {
    window.onload = (e) => {
      const applicabilityContainer = document.querySelector(
        '.applicability_wrap'
      );

      client('/api/applicability/?v=2&arts=' + this.articles)
        .then((res) => {
          applicabilityContainer.innerHTML = res;
          applicabilityContainer.classList.remove('load');
        })
        .finally(() => {
          const showBtn = document.querySelector('.table_body~.show_btn');

          this.applicabilityToggle();

          if (showBtn) {
            showBtn.addEventListener('click', (e) => {
              this.applicabilityToggle();
              showBtn.classList.add('none');
            });
          }
        });
    };
  }

  initForm() {
    Mask.create('#counter--inp', {
      mask: '####',
    });
    Mask.create('#order--inn', {
      mask: '############',
    });
    Mask.create('#order--phone', {
      mask: '+7 (###) ###-##-##',
    });
    // Mask.create('#order--email', {
    //   mask: 'X*@X*.X*',
    // });

    const innInp = document.querySelector('#order--inn');

    let validationInps = {
      'order--phone': { required: true, phone: true },
      'order--email': { required: true, email: true },
      'order--fio': { required: true },
    };

    innInp.addEventListener('input', (e) => {
      if (innInp.value.length) {
        validationInps['order--inn'] = { required: true, inn: true };
      } else {
        delete validationInps['order--inn'];
      }
    });

    new Form(validationInps, this.onValidation);

    const counterInp = document.querySelector('.counter .counter_inp');
    const counterPlus = document.querySelector('.counter .counter_plus');
    const counterMinus = document.querySelector('.counter .counter_minus');

    counterPlus.addEventListener('click', (e) => {
      if (+counterInp.value != 5000) counterInp.value = +counterInp.value + 1;
    });
    counterMinus.addEventListener('click', (e) => {
      if (+counterInp.value != 1) counterInp.value = +counterInp.value - 1;
    });

    counterInp.addEventListener('input', (e) => {
      if (!counterInp.value.length) counterInp.value = 1;
      if (+counterInp.value > 5000) counterInp.value = 5000;
      if (+counterInp.value < 1) counterInp.value = 1;
    });
  }

  onValidation() {
    const button = this.form.find('.order_submit');
    const orderPerent = document.querySelector('.menu_body.order');

    if (button.hasClass('Button--loading')) {
      return;
    }

    button.addClass('Button--loading');

    client(this.form[0].action, { body: this.form[0] }, true)
      .then((res) => {
        if (res.ok != 'error') {
          this.form[0].reset();

          orderPerent.classList.add('message');
          setTimeout((e) => {
            orderPerent.classList.remove('message');
          }, 7000);
        } else {
          this.setError(res.data);
        }
      })
      .finally(() => {
        button.removeClass('Button--loading');
      });
  }
}

new Card();
