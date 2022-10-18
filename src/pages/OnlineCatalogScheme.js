import Page from '../components/Page/Page';
import '../scss/pages/OnlineCatalogScheme/OnlineCatalogScheme';
import $ from 'cash-dom';
import Draggabilly from 'draggabilly';
import dropList from '../components/dropList';
import initApplicability from '../modules/initApplicability';

/**
 * OnlineCatalogScheme company page
 */
class OnlineCatalogScheme extends Page {
  constructor() {
    super();

    initApplicability();
    this.initDraggabilly();
    dropList('.quantity_drop-list, .oem-number_value');
  }

  initDraggabilly(){
    const scheme = $('.scheme');
    const original_wrapp = scheme.find('.draggabilly-overflow');
    const draggabilly_self = scheme.find('.draggabilly');
    const draggabilly_image_ovewflow = scheme.find(
      '.draggabilly .img-overflow'
    );
    const draggabilly_image = draggabilly_image_ovewflow.find('img');
    const spans = draggabilly_image_ovewflow.find('span');
    const info = scheme.find('.info');
    const products = $('.product');
    let draggabilly = false;
    let zoom = 0.5;

    // Для удобства скроллинга мобильных устройств мы не сразу инициализируем перетаскивание
    if (!isMobile()) {
      enableDraggabilly();
    }

    var img = scheme.find('.img-overflow img')[0];

    if (img.complete) {
      loaded();
    } else {
      img.addEventListener('load', loaded);
    }

    function loaded() {
      initJumping();
      resizeDefault();
      centerDraggabilly();
      img.closest('.draggabilly').classList.add('is-loaded');
    }

    $(window).on('resize', () => resizeDefault());

    $(document).on('click', (e) => {
      if (e.target.closest('.scheme .info:not(.hovered)')) {
        info.addClass('hovered');
      } else {
        info.removeClass('hovered');
      }
    });

    // На мобильниках инициилизируем перетаскивание только после нажатие на кнопки
    scheme
      .find('.increase, .decrease, .info, .labels')
      .on('click', (e) => enableDraggabilly());

    scheme.find('.labels').on('click', (e) => {
      spans.toggleClass('is-hidden');
      scheme.find('.labels').toggleClass('is-active');
    });

    scheme.find('.increase').on('click', (e) => resizeImage(0.1));
    scheme.find('.decrease').on('click', (e) => resizeImage(-0.1));

    // Сбрасывает увеличение и центрирует
    scheme.find('.window_size').on('click', (e) => {
      resizeDefault();
      if (draggabilly) {
        centerDraggabilly();
        // Если это мобильное ус-во, убираем дергание, для удобства
        if (isMobile()) disableDraggabilly();
      }
    });

    function resizeImage(num, isSet = false) {
      const savedZoom = zoom;

      zoom = isSet ? num : (zoom += num);

      if (zoom <= 0) {
        zoom = savedZoom;
      }

      draggabilly_self.css('transform', `scale(${zoom})`);
    }

    function initJumping() {
      const products = $(`div[data-index]`);

      spans.on('click', (e) => {
        const span = $(e.target);
        const product = $(`div[data-index="${span.attr('data-index')}"]`);
        scrollTo(product[0], 0, 350);
        selectProduct(product);
        selectSpan(span);
      });

      $('body').on('click', '.scheme-budge span', (e) => {
        const product = $(e.target).closest('[data-id]');
        const span = $(`span[data-index="${product.attr('data-index')}"]`);
        scrollTo(document.querySelector('h1'), 0, 250);
        selectProduct(product);
        selectSpan(span);
        centerDraggabilly();
        // resizeDefault();
      });

      function selectSpan(span) {
        spans.removeClass('is-active');
        $(`.label[data-index="${span.attr('data-index')}"`).addClass(
          'is-active'
        );
      }

      function selectProduct(product) {
        products.each((i, item) => item.classList.remove('is-active'));
        product.addClass('is-active');
      }
    }

    function disableDraggabilly() {
      draggabilly.destroy();
      draggabilly = false;
    }

    function enableDraggabilly() {
      if (!draggabilly) {
        draggabilly = new Draggabilly(draggabilly_image_ovewflow[0], {
          grid: isMobile() ? [120, 120] : [5, 5],
        });
      }
    }

    function centerDraggabilly() {
      if (draggabilly) {
        draggabilly.setPosition(0, 0);
      }
    }

    function resizeDefault() {
      const ImgWidth = draggabilly_image.width();
      const ImgHeight = getNormalHeightCachDomIsBAD(draggabilly_image);

      const ImgAreaWidth = original_wrapp.width();
      const ImgAreaHeight = getNormalHeightCachDomIsBAD(original_wrapp);

      const localZoom =
        Math.min.apply(null, [
          ImgAreaWidth / ImgWidth,
          ImgAreaHeight / ImgHeight,
        ]) * 1;

      resizeImage(localZoom, true);
      scheme.css('height', `${ImgHeight * localZoom}px`);

      function getNormalHeightCachDomIsBAD(el) {
        return parseFloat(
          getComputedStyle(el[0], null).height.replace('px', '')
        );
      }
    }

    function isMobile() {
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase()
      );
    }

    function scrollTo(target, offset = 110, speed = 400) {
      if (typeof target === 'string') {
        target = document.querySelector(target);
      }

      offset = !offset ? 110 : offset;

      if (target) {
        scrollPageTo(target, speed);
      }

      function scrollPageTo(to, duration = 500) {
        const easeInOutQuad = function (t, b, c, d) {
          t /= d / 2;
          if (t < 1) return (c / 2) * t * t + b;
          t--;
          return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        return new Promise((resolve, reject) => {
          const element = document.scrollingElement;

          if (typeof to === 'string') {
            to = document.querySelector(to) || reject();
          }

          if (typeof to !== 'number') {
            to = to.getBoundingClientRect().top + element.scrollTop;
          }

          let start = element.scrollTop,
            change = to - start - offset,
            currentTime = 0,
            increment = 20;

          const animateScroll = function () {
            currentTime += increment;
            let val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if (currentTime < duration) {
              setTimeout(animateScroll, increment);
            } else {
              resolve();
            }
          };
          animateScroll();
        });
      }
    }
  }
}

new OnlineCatalogScheme();
