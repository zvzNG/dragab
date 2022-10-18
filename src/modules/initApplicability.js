import client from './client';

// ====applicability==== \\
export default function () {
  /* init вызывается 2 раза из-за того что,
  *  в кталоге addEventListener срабатывает
  *  только при загрузке страницы
  */
  document.addEventListener('ncPartialUpdate', (e) => {
    if (
      Object.keys(e.detail.newTemplateContent)
        .toString()
        .indexOf('catalog_applicability') != -1
    ) {
      init();
    }
  });
  init();
}

function init() {
  const loadScreen = document.querySelector('#load_screen');
  const links = document.querySelectorAll('.applicability_value');
  if (links.length) {
    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      link.addEventListener('click', (e) => {
        loadScreen.classList.add('load');
        const articles = link.dataset.articles;
        const applicabilityContainer = document.querySelector(
          '.applicability_container'
        );

        client('/api/applicability/?v=1&arts=' + articles)
          .then((res) => {
            applicabilityContainer.innerHTML += res;
          })
          .finally(() => {
            loadScreen.classList.remove('load');
            let popup = document.querySelector('.popup');
            popup.addEventListener('click', (e) => {
              setTimeout(() => {
                applicabilityContainer.removeChild(popup);
              }, 300);
            });
          });
      });
    }
  }
}
