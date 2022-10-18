let event = false;

export default function (selectors, addEvents = true, toggleClass = '') {
  if (!event && addEvents) addTrigger(selectors);

  const dropItems = document.querySelectorAll(selectors);

  dropItems.forEach((el) => {
    el.addEventListener('click', (e) => {
      if (!el.classList.contains('active') && addEvents) {
        resetDropItem(selectors);
      }
      if (toggleClass) {
        if (el.classList.contains('active')) {
          el.classList.remove('active');
          el.classList.add(toggleClass);
        } else {
          el.classList.add('active');
          el.classList.remove(toggleClass);
        }
      } else {
        el.classList.toggle('active');
      }
    });
  });
}

function resetDropItem(selectors) {
  const elActive = document.querySelector(`${selectors}.active`);
  if (elActive) elActive.classList.remove('active');
}

function addTrigger(selectors) {
  event = true;
  window.addEventListener('click', (e) => {
    if (!e.target.closest(`${selectors}`)) {
      const el = document.querySelector(`${selectors}.active`);
      if (el) el.classList.remove('active');
    }
  });
}