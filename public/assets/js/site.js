(function () {
  const nav = document.querySelector('[data-js="nav"]');
  if (!nav) return;

  const toggle = nav.querySelector('.site-nav__toggle');
  const menu = nav.querySelector('.site-nav__list');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      menu.classList.toggle('is-open', !isOpen);
    });

    menu.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });
  }

  document.querySelectorAll('[data-js="year"]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();

