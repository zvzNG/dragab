import Page from '../components/Page/Page';
import '../scss/pages/OnlineCatalogModel/OnlineCatalogModel';
// import client from '../modules/client';
import dropList from '../components/dropList';
import '../modules/onlineCatalog-search';

/**
 * OnlineCatalogModel company page
 */
class OnlineCatalogModel extends Page {
  constructor() {
    super();

    this.initDropList();
    // dropList('.toggle_btn', false, 'hidden');
  }

  initDropList() {
    const btns = document.querySelectorAll('.toggle_btn');

    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const btnParent = btn.closest('li');
        const listBody = btnParent.querySelector('div');
        btn.classList.toggle('active');

        if (listBody?.classList.contains('active')) {
          listBody.classList.remove('active');
          listBody.classList.add('hidden');
        } else {
          listBody?.classList.add('active');
          listBody?.classList.remove('hidden');
        }
      });
    });
  }
}

new OnlineCatalogModel();
