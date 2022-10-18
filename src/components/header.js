import './clearInp.js';
import './PhoneForm.js';
import client from '../modules/client.js';

// ====menu==== \\

const triggersBody = document.querySelectorAll('.trigger-body');

window.addEventListener('click', (e) => {
  const el = e.target;

  if (!el.closest('.trigger-body') && !el.closest('.toggle-trigger')) {
    triggersBody.forEach((trigBody) => {
      trigBody.classList.remove('active');
    });
  }

  if (el.closest('.toggle-trigger')) {
    const btn = el.closest('.toggle-trigger');
    const btnLink = btn.dataset.link;
    const trigBody = document.querySelector(btnLink);
    removeTrigBody(trigBody);
    trigBody.classList.toggle('active');
  }
});

function removeTrigBody(el) {
  const activeBody = document.querySelector('.trigger-body.active');
  if (activeBody != el && activeBody) {
    activeBody.classList.remove('active');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.which === 27) {
    triggersBody.forEach((body) => body.classList.remove('active'));
  }
});

// ===========setHeader=========== \\

const header = document.querySelector('.header');
let prevPosition = window.pageYOffset;
const windowHiegiht = window.innerHeight;

function setHeader() {
  let scrollY = window.pageYOffset;

  if (prevPosition > windowHiegiht / 4 && prevPosition <= scrollY) {
    prevPosition = window.pageYOffset;
    header.classList.add('hidden');
  } else {
    prevPosition = window.pageYOffset;
    header.classList.remove('hidden');
  }
}

setHeader();
window.onscroll = setHeader;

// ===========AsideBlock=========== \\

window.onresize = setDropLIst;

let addListener = true;

function setDropLIst() {
  const sidebarTitles = document.querySelectorAll(
    '.aside-block_title, li .toggle_btn'
  );

  sidebarTitles.forEach((title) => {
    const li = title.closest('li');
    li.style.height = title.clientHeight + 'px';

    if (addListener) {
      title.addEventListener('click', (e) => {
        li.classList.toggle('active');
        const isActive = li.classList.contains('active');

        if (isActive) {
          li.style.height = setHeight(title, isActive);
        } else {
          li.style.height = setHeight(title, isActive);
        }
      });
    }
  });

  addListener = false;
}

function setHeight(el, isActive) {
  const li = el.closest('li');
  const dropListPerent = li.closest('ul').closest('li');
  const dropList = li.querySelector('ul');
  let height = el.clientHeight + (isActive ? dropList.clientHeight : 0) + 'px';

  console.log(dropListPerent);

  if (dropListPerent) {
    const titleHeight = dropListPerent.querySelector('.toggle_btn').clientHeight;
    const ulHeight = dropListPerent.querySelector('ul').clientHeight;
    dropListPerent.style.height =
      titleHeight +
      ulHeight +
      (isActive ? dropList.clientHeight : -dropList.clientHeight) +
      'px';
  }
  return height;
}

setDropLIst();

// =============search_prompt============= \\

const searchForm = document.getElementById('header-search');
const searchInp = searchForm.querySelector('.inp_search');
const prompt = document.querySelector('.header .search_prompt');
let ajax;
// let searchLock = true

searchInp.addEventListener('input', getPrompt);
searchForm.addEventListener('click', getPrompt);

searchForm.addEventListener('submit', (e) => {
  if (searchInp.value.length == 0) {
    e.preventDefault();
    prompt.innerHTML =
      '<div class="search_fail">Запрос не должен быть пустым</div>';
  }
});

function getPrompt() {
  if (searchInp.value.length > 2) {
    clearTimeout(ajax);
    ajax = setTimeout(() => {
      client(`/catalog/?isNaked=1&nc_ctpl=229&find=${searchInp.value}`)
        .then((res) => {
          prompt.innerHTML = res;
          prompt.classList.remove('none');
        })
        .finally(() => {});
    }, 600);
  } else {
    clearTimeout(ajax);
    prompt.innerHTML = '';
    prompt.classList.add('none');
  }
}

// function addPromptEvent() {
window.addEventListener('click', (e) => {
  if (
    !e.target.closest('.search.form') &&
    !e.target.closest('.search_prompt')
  ) {
    // prompt.innerHTML = '';
    prompt.classList.add('none');
  }
});
// }
