const inpsSearch = document.querySelectorAll('.inp_search');
const inpsClearSearch = document.querySelectorAll('.search_clear');

for (let i = 0; i < inpsClearSearch.length; i++) {
  const clearSearch = inpsClearSearch[i];
  const inpSearch = inpsSearch[i];
  const form = inpSearch.closest('.form');

  if (inpSearch.value.length > 0) {

    form.classList.add('active');
  }
  clearSearch.addEventListener('click', (e) => {
    e.preventDefault();
    inpSearch.value = '';
    form.classList.remove('active');
  });

  inpSearch.addEventListener('input', (e) => {
    if (inpSearch.value.length > 0) {
      form.classList.add('active');
    } else {
      form.classList.remove('active');
    }
  });
}
