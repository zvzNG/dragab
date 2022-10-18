import $ from 'cash-dom';

// css solution is not working in IE11, and this code not working too,
// but i will not delete this, mb im some browsers that will be useful

const $body = $('body');
const superClass = 'is-fouced-or-filled';

const fixInputs = () => {
  $('.Input__input').each((i, item) => {
    const nodeName = item.nodeName.toLowerCase();

    if (nodeName == 'input') {
      if (item.value) {
        $(item).closest('.Input').addClass(superClass);
      } else {
        $(item).closest('.Input').removeClass(superClass);
      }
    } else if (nodeName == 'select') {
      const activeOption = item.options[item.selectedIndex];

      if (activeOption) {
        if (activeOption.hasAttribute('disabled')) {
          $(item)
            .closest('.Input')
            .addClass('not-active')
            .removeClass(superClass);
        } else {
          $(item).closest('.Input').addClass(superClass);
        }
      } else {
        $(item).closest('.Input').addClass(superClass);
      }
    }
  });
};

fixInputs();
$body.on('click', fixInputs);

$body.on('focus click', '.Input__input', ({ currentTarget }) => {
  $(currentTarget).closest('.Input').addClass(superClass);
});
