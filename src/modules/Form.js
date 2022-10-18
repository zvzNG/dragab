// import $ from 'cash-dom';
// import './input';
// import '../sass/components/Form';

/**
 * Form class
 *
 * this.form in another files from THIS class
 */
export default class Form {
  constructor(options, callback = () => {}, $this) {
    this.form = document
      .getElementById(Object.keys(options)[0])
      .closest('.form');
    this.errorNode = this.form.querySelector('.form_error');
    this.options = options || {};
    this.errors = [];
    this.$this = $this;
    this.callback = callback;

    this.listenForm();
  }

  validateGuest() {
    const workers = {
      // dom == id
      required: (dom) => {
        const _dom = dom[0];

        if (dom.nodeName === 'SELECT') {
          if (dom.options[dom.selectedIndex].disabled) {
            this.setInvalid(dom);
            this.errors.push(`Заполните поля «${dom.dataset.title}»`);
          } else {
            this.setValid(dom);
          }

          return;
        }

        if (!dom.value.trim()) {
          this.setInvalid(dom);
          this.errors.push(`Заполните поле «${dom.dataset.title}»`);
        } else {
          this.setValid(dom);
        }
      },

      phone: (dom) => {
        const PHONE_LENGTH = 18;
        if (dom.value.length === PHONE_LENGTH) {
          this.setValid(dom);
        } else {
          this.setInvalid(dom);
          this.errors.push(`Заполните поле «${dom.dataset.title}» корректно`);
        }
      },

      inn: (dom) => {
        const INN_LENGTH = [10, 12];

        if (INN_LENGTH.includes(dom.value.length)) {
          this.setValid(dom);
        } else {
          this.setInvalid(dom);
          this.errors.push(
            `Поле «${dom.dataset.title}» должно содержать 10 или 12 цифр`
          );
        }
      },

      email: (dom) => {
        const REGEX =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // console.log(REGEX.test(dom.value.trim()));

        if (REGEX.test(dom.value.trim())) {
          this.setValid(dom);
        } else {
          this.setInvalid(dom);
          this.errors.push(`Заполните поле «${dom.dataset.title}» корректно`);
        }
      },

      skip: () => {
        /* stoopid dummy dim dam */
      },
    };

    this.errors = [];

    for (const option in this.options) {
      const rules = this.options[option];
      const dom = document.getElementById(option);

      const isHereSkip = rules['skip'];
      const shouldISkip = isHereSkip ? !isHereSkip() : false;

      if (!isHereSkip || (isHereSkip && shouldISkip)) {
        for (const rule in rules) {
          // console.log(rule, dom);
          workers[rule](dom);
        }
      }
    }
  }

  setInvalid(dom) {
    dom.classList.add('is-invalid');
  }

  setValid(dom) {
    dom.classList.remove('is-invalid');
  }

  fillErrorNode(text) {
    this.errorNode.classList.add('is-active');
    const errorNode = this.errorNode.querySelector('span') || this.errorNode;
    errorNode.textContent = text;
  }

  unfillErrorNode(text) {
    this.errorNode.classList.remove('is-active');
    const errorNode = this.errorNode.querySelector('span') || this.errorNode;
    errorNode.textContent = '';
  }

  setError(text) {
    this.fillErrorNode(text);
  }

  listenForm() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateGuest();

      if (this.errors.length) {
        this.fillErrorNode(this.errors[0]);
      } else {
        this.unfillErrorNode();
        this.callback(this.$this);
      }
    });
  }
}
