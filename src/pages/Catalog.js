import Page from '../components/Page/Page';
import '../scss/pages/Catalog/Catalog.scss';
import '../modules/popup';
import dropList from '../components/dropList';
import lozad from 'lozad';
// import $ from 'cash-dom';
import client from '../modules/client';
import getURLAttribute from '../modules/getURLAttribute';
import initApplicability from '../modules/initApplicability';
import getURL from '../modules/getURL';
// import { prototype } from 'core-js/core/dict';

/**
 * Catalog page
 */

class Catalog extends Page {
  constructor() {
    super();

    this.$cardContainer = document.querySelector('.products');
    this.$resetBtn = document.querySelector(
      '.yellow_btn.reset_btn.hover_black'
    );
    this.$filterInps = document.querySelectorAll(
      '.filter_label .filter_label__inp input'
    );
    this.$options = document.querySelector('.options');

    this.filterHide =
      document.querySelector('.product-content').dataset.filterHide;

    // из этого объекта создаётся url
    this.params = {};
    // в этом объекте хранятся параметры для кнопок с опциями
    this.BtnsOptions = {};

    this.initResetBtn();
    this.updateEvents();

    this.initAsideBlock();

    this.filters();
    this.setFilter();

    this.addOptions();
    this.resetOptions();
  }

  initResetBtn() {
    if (this.$resetBtn) {
      this.$resetBtn.addEventListener('click', (e) => {
        this.resetFilter();
        this.$resetBtn.classList.remove('active');

        this.showContent();
      });
    }
  }

  updateEvents() {
    this.showCards();
    dropList('.oem-number_value');
    this.initLazyLoad();
    this.pagination();
    initApplicability();
  }

  initLazyLoad() {
    // I picked older(1.5.0) lozad version, because its size is smaller
    this.observeLazeImages = lozad('img[data-srcset]').observe;
    this.observeLazeImages();
  }

  initAsideBlock() {
    document.addEventListener('ncPartialUpdate', (e) => {
      if ('categories_list' in e.detail.newTemplateContent) {
        const sidebarTitles = document.querySelectorAll('.AsideBlock__title');
        for (let i = sidebarTitles.length / 2; i < sidebarTitles.length; i++) {
          const title = sidebarTitles[i];
          title.addEventListener('click', (e) => {
            title.classList.toggle('is-active');
          });
        }
      }
    });
  }

  // ====add options==== \\
  addOptions() {
    let find = getURLAttribute('find');
    

    if (find.split('=')[1]) {
      this.$options.innerHTML += `
      <button class="filter_btn" data-option="find">
        Поиск: <span class="value">
          ${decodeURIComponent(find).split('=')[1]}
        </span>
        <span class="close">
          <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
            <use href="/icons/sprite.svg#close"></use>
          </svg>
        </span>
      </button>`;
    } else {
      delete this.BtnsOptions.find;
    }

    if (Object.keys(this.BtnsOptions).length) {
      for (const name in this.BtnsOptions) {
        const value = this.BtnsOptions[name];

        // проверяю на всякий случай, не пустые ли поля
        if (
          typeof value == 'object' &&
          Object.values(value).length &&
          value.text &&
          value.value
        ) {
          this.$options.innerHTML += `
            <button 
              class="filter_btn" 
              data-option="${name}">
              ${value.text}: <span class="value">
                ${value.value}
              </span>
              <span class="close">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                  <use href="/icons/sprite.svg#close"></use>
                </svg>
              </span>
            </button>`;
        }
      }
    }
  }

  // ====reset options==== \\
  resetOptions() {
    document.body.addEventListener('click', (e) => {
      const el = e.target.closest('.filter_btn[data-option]');
      if (el) {
        const btn = el;
        const paramName = btn.dataset.option;
        const URLValue = getURLAttribute(paramName);
        let url = location.href.replace(URLValue, '');

        delete this.params[paramName];
        delete this.BtnsOptions[paramName];

        // тут возникли проблемы с find, по этому тут по своему записывается URL
        if (url.indexOf('?') != -1) {
          window.history.replaceState(null, null, url);
        } else {
          window.history.replaceState(null, null, url.replace('&', '?'));
        }

        this.showContent(
          () => {
            if (location.pathname == '/catalog/' && paramName == 'find') {
              document.querySelector('h1').innerHTML =
                'Каталог запчастей GILBER';

              // это чтобы в подразделах всё было нормально
              const disabledLabels =
                document.querySelectorAll('label.disabled');

              for (let i = 0; i < disabledLabels.length; i++) {
                const label = disabledLabels[i];
                const inp = label.querySelector('input[disabled]');

                label.classList.remove('disabled');
                inp.disabled = false;
              }
            }

            const arr = document
              .querySelector(`[data-filter-name="${paramName}"]`)
              .querySelectorAll('input');
            const btn = arr[0].closest('div').querySelector('button');

            btn.classList.remove('active');

            for (let i = 0; i < arr.length; i++) {
              const inp = arr[i];
              if (inp.type == 'checkbox') {
                inp.checked = false;
              } else {
                inp.value = '';
              }
            }

            this.addOptions();
          },
          false,
          false
        );

        // console.log('option:', btn.dataset.option);
        // console.log('url:', url);
        // console.log('params:', this.params);
        // console.log(getURL(this.params, 'isNaked=1'));
      }
    });
  }

  // ====filters==== \\
  filters() {
    for (let i = 0; i < this.$filterInps.length; i++) {
      const inp = this.$filterInps[i];
      inp.addEventListener('change', (e) => {
        const filterName = inp.closest('[data-filter-name]').dataset.filterName;

        this.params[filterName] = {};
        this.BtnsOptions[filterName] = {};

        delete this.params.page;

        this.setFilter();

        if (Object.keys(this.params.marks).length) {
          this.$resetBtn.classList.add('active');
        } else {
          this.$resetBtn.classList.remove('active');
        }

        this.showContent(this.addOptions());
      });
    }
  }

  // ====set filter==== \\
  setFilter() {
    const filtersContainer = document.querySelectorAll('[data-filter-name]');

    for (let i = 0; i < filtersContainer.length; i++) {
      const container = filtersContainer[i];
      const filterName = container.dataset.filterName;
      const filterText = container.dataset.filterText;

      this.params[filterName] = {};
      this.BtnsOptions[filterName] = {};

      const filterInps = container.querySelectorAll('input');

      for (let a = 0; a < filterInps.length; a++) {
        const inp = filterInps[a];

        if (inp.checked) {
          this.params[filterName][inp.value] = a;
          this.$resetBtn.classList.add('active');

          if (Object.keys(this.params.marks).length > 1) {
            this.BtnsOptions[filterName].text = filterText;
            this.BtnsOptions[filterName].value =
              Object.keys(this.params.marks).length + ' значения';
          } else {
            this.BtnsOptions[filterName].text = filterText;
            this.BtnsOptions[filterName].value = inp
              .closest('.filter_label')
              .querySelector('.filter_label__text').textContent;
          }
        }
      }
    }
  }

  // ====reset filter ==== \\
  resetFilter() {
    delete this.params.marks;
    delete this.BtnsOptions.marks;

    for (let i = 0; i < this.$filterInps.length; i++) {
      const inp = this.$filterInps[i];
      inp.checked = false;
    }
    this.addOptions();
    this.$resetBtn.classList.remove('active');
  }

  // ====btn: show cards==== \\
  showCards() {
    this.btn = document.querySelector('.yellow_btn.hover_black.show_btn');

    const showCards = () => {
      this.btn.classList.add('Button--loading');
      const pageNext = this.btn.dataset.pageNumber;

      this.params.page = pageNext;

      this.showContent(() => {}, true);
    };
    if (this.btn) this.btn.addEventListener('click', showCards);
  }

  // ====pagination==== \\
  pagination() {
    const paginationLinks = document.querySelectorAll('.Pagination__inner a');

    for (let i = 0; i < paginationLinks.length; i++) {
      const link = paginationLinks[i];
      link.addEventListener('click', (e) => {
        e.preventDefault();

        if (link.getAttribute('href') != location.pathname) {
          this.params.page = link.getAttribute('href').replace('?page=', '');
        } else {
          delete this.params.page;
        }

        this.showContent();
      });
    }
  }

  showContent(func = () => {}, addContent = false, setURL = true) {
    const loadScreen = document.querySelector('#load_screen');
    const filterContainer = document.querySelector('.filters_wrap');
    if (!addContent) {
      loadScreen.classList.add('load');
      this.goTop();
    }

    client(getURL(this.params, 'isNaked=1'))
      .then((res) => {
        if (addContent) {
          const oldPagination =
            this.$cardContainer.querySelector('.Pagination');

          this.$cardContainer.removeChild(oldPagination);
          this.$cardContainer.removeChild(this.btn);
          this.btn = document.querySelector('.yellow_btn.show_btn');
          this.$cardContainer.innerHTML += res;
        } else {
          this.$cardContainer.innerHTML = res;
        }

        if (res == '') {
          this.filterHide = 0;
          filterContainer.classList.add('none');
        } else {
          this.filterHide = 1;
          filterContainer.classList.remove('none');
        }
        // console.log(res);
      })
      .then(() => {
        if (setURL) window.history.replaceState(null, null, getURL(this.params));
        this.updateEvents();
        loadScreen.classList.remove('load');
        func();
      })
      .catch((err) => {
        // this.$cardContainer.innerHTML = '<div class="fail-message"><span>Что-то пошло не так</span></div>';
        alert('Что-то пошло не так');
        console.error(err);
        loadScreen.classList.remove('load');
      });
  }
}

new Catalog();
