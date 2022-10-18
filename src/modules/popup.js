const popupLinks = document.querySelectorAll('.popup_link');
const lockPadding = document.querySelector('.lock_padding');
const body = document.querySelector('body');

const timeout = 300;

let unlock = true;

if (popupLinks.length > 0) {
  for (let i = 0; i < popupLinks.length; i++) {
    const popupLink = popupLinks[i];

    popupLink.addEventListener('click', function (e) {
      const popupName = popupLink.dataset.link;
      const currentPopup = document.getElementById(popupName);

      e.preventDefault();
      popupOpen(currentPopup);
    });
  }
}

const popupCloseIcon = document.querySelectorAll('.close_popup');

if (popupCloseIcon.length > 0) {
  for (let i = 0; i < popupCloseIcon.length; i++) {
    const el = popupCloseIcon[i];
    el.addEventListener('click', function (e) {
      popupClose(el.closest('.popup'));
      e.preventDefault();
    });
  }
}

function popupOpen(currentPopup) {
  if (currentPopup && unlock) {
    popupActive = document.querySelector('.popup.open');

    if (popupActive) {
      popupClose(popupActive, false);
    } else {
      bodyLock();
    }
    currentPopup.classList.add('open');
  }
}

var popupActive = document.querySelector('.popup.open');

window.addEventListener('click', function (e) {
  popupActive = document.querySelector('.popup.open');
  if (!e.target.closest('.popup_content')) {
    if (popupActive) {
      popupClose(popupActive);
    }
  }
});

function popupClose(popupActive, doUnlock = true) {
  if (unlock) {
    popupActive.classList.remove('open');
    if (doUnlock) {
      bodyUnLock();
    }
  }
}

function bodyLock() {
  const lockPaddingValue =
    window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
  body.style.paddingRight = lockPaddingValue;
  // if (lockPadding) {
  //     for (let i = 0; i < lockPadding.length; i++) {
  //         const el = lockPadding[i];
  //         el.style.PaddingRight = lockPaddingValue;
  //     }
  // }
  body.classList.add('lock');

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function bodyUnLock() {
  setTimeout(function () {
    if (lockPadding) {
      for (let i = 0; i < lockPadding.length; i++) {
        const el = lockPadding[i];
        el.style.PaddingRight = '0px';
      }
    }
    body.style.PaddingRight = '0px';
    body.classList.remove('lock');
  }, timeout);

  unlock = false;
  setTimeout(function () {
    body.style.paddingRight = 0;
    unlock = true;
  }, timeout);
}

document.addEventListener('keydown', function (e) {
  if (e.which === 27) {
    const popupActive = document.querySelector('.popup.open');
    if (popupActive) popupClose(popupActive);
  }
});
