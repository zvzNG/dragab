import Page from '../components/Page/Page';
import '../scss/pages/OnlineCatalogScheme/OnlineCatalogScheme';
// import $ from 'cash-dom';
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

  initDraggabilly() {
    const scheme = document.querySelector('.scheme');
    const original_wrapp = scheme.querySelector('.draggabilly-overflow');
    const draggabilly_self = scheme.querySelector('.draggabilly');
    const draggabilly_image_ovewflow = scheme.querySelector(
      '.draggabilly .img-overflow'
    );
    const draggabilly_image = draggabilly_image_ovewflow.querySelector('img');
    const spans = draggabilly_image_ovewflow.querySelectorAll('span');

    const info = scheme.querySelector('.info');

    let draggabilly = false;
    let zoom = 0.5;

    // Для удобства скроллинга мобильных устройств мы не сразу инициализируем перетаскивание
    if (!isMobile()) {
      enableDraggabilly();
    }

    var img = scheme.querySelector('.img-overflow img');

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

    window.addEventListener('resize', () => resizeDefault());

    window.addEventListener('click', (e) => {
      console.log(e.target)
      if (e.target.closest('.scheme .info:not(.hovered)')) {
        info.classList.add('hovered');
      } else {
        info.classList.remove('hovered');
      }
    });

    // На мобильниках инициилизируем перетаскивание только после нажатие на кнопки
    const schemeInterface = scheme.querySelectorAll('.scheme_interface');

    schemeInterface.forEach((item) => {
      item.addEventListener('click', (e) => enableDraggabilly());
    });

    // scheme
    //   .find('.increase, .decrease, .info, .labels')
    //   .on('click', (e) => enableDraggabilly());

    const labels = scheme.querySelector('.labels');

    labels.addEventListener('click', (e) => {
      spans.forEach((span) => {
        span.classList.toggle('is-hidden');
      });
      labels.classList.toggle('is-active');
    });

    const increase = scheme.querySelector('.increase');
    const decrease = scheme.querySelector('.decrease');

    increase.addEventListener('click', (e) => resizeImage(0.1));
    decrease.addEventListener('click', (e) => resizeImage(-0.1));

    // Сбрасывает увеличение и центрирует
    const windowSize = scheme.querySelector('.window_size');

    windowSize.addEventListener('click', (e) => {
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

      draggabilly_self.style.transform = `scale(${zoom})`;
    }

    function initJumping() {
      window.addEventListener('click', (e) => {
        console.log(isMobile());
        //   if (e.target.closest('span.label[data-index]')) {
        //     const span = e.target;
        //     const index = span.dataset.index;
        //     const product = document.querySelector(`div[data-index="${index}"]`);
        //     scrollTo(product, 0, 400);
        //     selectProduct(product);
        //     selectSpan(span);
        //   }
      });

      const JumpPoints = scheme.querySelectorAll('span.label[data-index]');

      JumpPoints.forEach((point) => {
        point.addEventListener('click', (e) => {
          // e.stopPropagation();
          const index = point.dataset.index;

          console.log(index);

          const product = document.querySelector(`div[data-index="${index}"]`);
          scrollTo(product, 0, 400);
          selectProduct(product);
          selectSpan(point);
        });
      });

      window.addEventListener('click', (e) => {
        if (e.target.closest('.scheme-budge span')) {
          const product = e.target.closest('[data-id]');
          const index = product.dataset.index;
          const span = document.querySelector(`span[data-index="${index}"]`);
          scrollTo(document.querySelector('h1'), -45, 400);
          selectProduct(product);
          selectSpan(span);
          centerDraggabilly();
          resizeDefault();
        }
      });

      function selectSpan(span) {
        removeActive('.label[data-index]');
        const index = span.dataset.index;
        const labels = document.querySelectorAll(`.label[data-index="${index}"`);
        labels.forEach(label => label.classList.add('is-active'));
      }

      function selectProduct(product) {
        removeActive('div[data-index]');
        product?.classList.add('is-active');
      }
    }

    function removeActive(selector) {
      const activeEls = document.querySelectorAll(`${selector}.is-active`);
      activeEls?.forEach(activeEl => activeEl.classList.remove('is-active'));
    }

    function disableDraggabilly() {
      draggabilly.destroy();
      draggabilly = false;
    }

    function enableDraggabilly() {
      if (!draggabilly) {
        draggabilly = new Draggabilly(draggabilly_image_ovewflow, {
          // grid: isMobile() ? [120, 120] : [5, 5],
          grid: [5, 5],
        });
      }
    }

    function centerDraggabilly() {
      if (draggabilly) {
        draggabilly.setPosition(0, 0);
      }
    }

    function resizeDefault() {
      const ImgWidth = draggabilly_image.clientWidth;
      const ImgHeight = getNormalHeightCachDomIsBAD(draggabilly_image);

      const ImgAreaWidth = original_wrapp.clientWidth;
      const ImgAreaHeight = getNormalHeightCachDomIsBAD(original_wrapp);

      const localZoom =
        Math.min.apply(null, [
          ImgAreaWidth / ImgWidth,
          ImgAreaHeight / ImgHeight,
        ]) * 1;

      resizeImage(localZoom, true);
      scheme.style.height = `${ImgHeight * localZoom}px`;

      function getNormalHeightCachDomIsBAD(el) {
        return parseFloat(getComputedStyle(el, null).height.replace('px', ''));
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
