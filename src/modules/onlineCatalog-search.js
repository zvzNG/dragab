import client from '../modules/client';
import getURL from '../modules/getURL';
// import '../scss/components/onlineCatalog-search.scss';
// import '../scss/components/table_search.scss';
import '../scss/components/table_search.scss';

const form = document.getElementById('catalog-search');
const searchInp = form.querySelector('.inp_search');
const btnClear = form.querySelector('.search_clear');
const promptContainer = document.querySelector('.search_list.online-catalog');

const markId = document.querySelector('[data-mark-id]');
const modelId = document.querySelector('[data-model-id]');

let searchList;
let param = {};

// export default function () {
  // searchInp.addEventListener('input', (e) => {
  //   if (searchInp.value.length > 2) {
  //     clearTimeout(ajax);

  //     ajax = setTimeout(() => {
  //       setPrompt(searchInp);
  //     }, 600);
  //   } else {
  //     clearTimeout(ajax);
  //     promptContainer.innerHTML = '';
  //   }
  // });

  btnClear.addEventListener('click', (e) => {
    promptContainer.innerHTML = '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchInp.value.length > 2) {
      form.classList.add('load');
      setPrompt(searchInp, param.page);
    }
  });
// }

function setPrompt(input, page = 1, showMore = true) {
  let body = { q: input.value };

  param.page = +page;

  if (markId) {
    param.type = 1;
    body.mark = markId.dataset.markId;
  }

  if (modelId) {
    param.type = 2;
    body.model = modelId.dataset.modelId;
  }

  client('/api/search-to-acat/' + getURL(param), { body: body }, false).then(
    (res) => {
      if (JSON.parse(res.ok)) {
        searchList = res.data.items;
        let showBtn = ``;
        if (showMore) {
          promptContainer.innerHTML = `
            <div class="search_titles">
              <div class="search_title article">Артикул</div>
              <div class="search_title name">Название</div>
              <div class="search_title scheme">Схема</div>
            </div>
        `;
        }

        if (res.data.allCount > 100 * page) {
          showBtn = `
            <button 
              class="yellow_btn submit_btn hover_black show_btn" 
              data-next-page="${(page += 1)}">
                <span class="text">Показать ещё</span>
                <span class="load">
                  <img src="/icons/load_round.svg" alt="">
                </span>
              </button>
            `;
        }

        showTable(searchList);
        const showBtnOld = document.querySelector('.yellow_btn.show_btn');

        if (showBtnOld) promptContainer.removeChild(showBtnOld);

        promptContainer.innerHTML += showBtn;
        initShowBtn(searchList);
      } else {
        promptContainer.innerHTML = res.data;
      }
      form.classList.remove('load');
    }
  );
}

function showTable(arr) {
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    const breadcrumbsArr = el.Path.split('|');
    let breadcrumbs = '';

    for (let a = 0; a < breadcrumbsArr.length - 2; a++) {
      const text = breadcrumbsArr[a];

      breadcrumbs += `
        <li class="breadcrumbs_item">
          <span class="breadcrumbs_item__text">${text}</span>
        </li>
        `;
    }

    promptContainer.innerHTML += `
      <div class="search_item">
        <div class="search_artikul article">
          ${el.Articul}
          </div>
          <div class="search_title name">
            ${el.Name}
          </div>
          <ul class="breadcrumbs scheme search_breadcrumbs">
            ${breadcrumbs}
            <li class="breadcrumbs_item">
              <a class="breadcrumbs_link" href="${el.Url}" itemprop="name">
                <span class="text">${
                  breadcrumbsArr[breadcrumbsArr.length - 1]
                }</span>
              </a>
            </li>
        </ul>
      </div>
      `;
  }
}

function initShowBtn() {
  const showBtn = document.querySelector('.yellow_btn.show_btn');

  if (showBtn) {
    showBtn.addEventListener('click', (e) => {
      const page = +showBtn.dataset.nextPage;
      showBtn.classList.add('Button--loading');
      setPrompt(searchInp, page, false);
    });
  }
}
