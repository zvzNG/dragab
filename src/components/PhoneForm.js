import client from '../modules/client';
import Form from '../modules/Form';
// const Mask = require('maska');
import * as Mask from 'maska';

// ====phone_validation==== \\
const PhoneForm = class {
  constructor() {
    this.initGetForm();
  }

  initGetForm() {
    const phoneBtn = document.querySelector('.header_btn.phone');

    phoneBtn.addEventListener('click', getForm);

    function getForm() {
      client('/callback/?isNaked=1').then((res) => {
        PhoneForm.prototype.formSet(res);
        phoneBtn.removeEventListener('click', getForm);
      });
    }
  }

  formSet(response) {
    const menuPhone = document.querySelector('.menu_body.phone .form_wrap');
    menuPhone.innerHTML += response;
    // ====mask_phone==== \\
    Mask.create('#user--phone', {
      mask: '+7 (###) ###-##-##',
    });

    menuPhone.classList.remove('load');

    this.validation();
  }

  validation() {
    new Form(
      {
        'user--phone': { required: true, phone: true },
      },
      this.phoneValidation
    );
  }

  phoneValidation() {
    const button = this.form.querySelector('.submit_btn');
    const menuPhone = document.querySelector('.menu_body.phone');

    if (button.classList.contains('Button--loading')) {
      return;
    }

    button.classList.add('Button--loading');

    client(this.form.action, { body: this.form }, true)
      .then((res) => {
        console.log(res);
        if (res.ok) {
          this.form.reset();
          menuPhone.classList.add('message');
          setTimeout((e) => {
            menuPhone.classList.remove('message');
          }, 7000);
        } else {
          this.setError(res.data);
        }
      })
      .finally(() => {
        button.classList.remove('Button--loading');
      });
  }
};

new PhoneForm();
