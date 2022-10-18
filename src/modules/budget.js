import '../scss/modules/baguettebox.scss';
import baguetteBox from 'baguettebox.js';
import $ from 'cash-dom';

const navText = [
  `<svg fill="none" height="14" viewBox="0 0 17 14" width="17" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.97386 1L1 6.97441L7 13" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="22.9256" stroke-width="2"></path>
    <line stroke-linecap="round" stroke-width="2" transform="matrix(-1 0 0 1 17 8)" x1="1" x2="9" y1="-1" y2="-1"></line>
  </svg>`,
  `<svg fill="none" height="14" viewBox="0 0 17 14" width="17" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.0261 1L16 6.97441L10 13" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="22.9256" stroke-width="2"></path>
    <line stroke-linecap="round" stroke-width="2" x1="1" x2="9" y1="7" y2="7"></line>
  </svg>`,
];

const closeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path d="M1 18L18 1.00001" stroke="#FFED00" stroke-width="2" stroke-linecap="round"/>
    <path d="M18 18L1.00001 1.00001" stroke="#FFED00" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;

const options = {
  noScrollbars: true,
  preload: 1,
  onChange,
};

function onChange(index, total) {
  let str = '';

  index++;

  if (total > 1) {
    str = `${index} / ${total}`;
  }

  if (str) {
    document.querySelector('.baguetteBox-status').remove();
    // $('.baguetteBox-status').remove();
    $('#baguetteBox-overlay').append(
      `<div class="baguetteBox-status">${str}</div>`
    );
  } else {
    $('.baguetteBox-status').remove();
  }
}

function changeUIElements() {
  const prevBtn = document.querySelector('.baguetteBox-button#previous-button');
  const nextBtn = document.querySelector('.baguetteBox-button#next-button');
  const closeBtn = document.querySelector('.baguetteBox-button#close-button');
  // Change baguetteBox buttons layout
  prevBtn.innerHTML = navText[0];
  nextBtn.innerHTML = navText[1];
  closeBtn.innerHTML = closeSvg;
}

export function specialInit(qs, ops) {
  baguetteBox.run(qs, { ...options, ...ops });
  changeUIElements();
}

export default function () {
  baguetteBox.run('[data-baguettebox-trigger]', options);
  changeUIElements();
}
