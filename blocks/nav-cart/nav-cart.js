import { fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();

  const cartButton = document.createElement('button');
  block.append(cartButton);

  let timer;
  const hideDropdown = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      block.setAttribute('aria-expanded', 'false');
    }, 500);
  };
  const onMouseLeave = () => {
    hideDropdown();
    cartButton.removeEventListener('mouseleave', onMouseLeave);
  };

  cartButton.addEventListener('click', () => {
    block.setAttribute('aria-expanded', 'true');
    cartButton.addEventListener('mouseleave', onMouseLeave);
  });

  const dropdown = document.createElement('div');
  const dropdownContent = document.createElement('div');
  dropdown.classList.add('nav-cart__dropdown');
  dropdownContent.classList.add('nav-cart__dropdown__content');
  dropdownContent.textContent = placeholders.navCartEmpty;
  dropdown.append(dropdownContent);
  block.append(dropdown);
}
