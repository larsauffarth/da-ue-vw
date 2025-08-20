import { searchBox } from '../search/search.js';
import { decorateIcons, fetchPlaceholders } from '../../scripts/aem.js';

export function closeSearch(block) {
  block.setAttribute('aria-expanded', false);
  // eslint-disable-next-line no-use-before-define
  window.removeEventListener('keydown', closeOnEscape);
  // eslint-disable-next-line no-use-before-define
  document.removeEventListener('click', closeOnClickOutside);
}

function openSearch(block) {
  block.setAttribute('aria-expanded', true);
  // eslint-disable-next-line no-use-before-define
  window.addEventListener('keydown', closeOnEscape);
  // eslint-disable-next-line no-use-before-define
  document.addEventListener('click', closeOnClickOutside);
}

function closeOnEscape(e) {
  const block = document.querySelector('header .nav-search');
  if (e.code === 'Escape') {
    closeSearch(block);
  }
}

function closeOnClickOutside(e) {
  const block = document.querySelector('header .nav-search');
  if (!block.contains(e.target)) {
    closeSearch(block);
  }
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();

  const tagsContent = block.querySelector(':scope > div:first-child');
  tagsContent.classList.add('nav-search__dropdown__content__tags');

  const form = document.createElement('form');
  form.setAttribute('action', 'https://www.volkswagen-group.com/de/suche'); // FIXME: take from project config.
  const search = searchBox({ placeholders });
  decorateIcons(search);
  search.classList.add('nav-search__dropdown__content__search');
  search.querySelector('input').setAttribute('name', 'query');
  form.append(search);

  const searchCaption = document.createElement('div');
  searchCaption.classList.add('nav-search__dropdown__content__caption');
  searchCaption.textContent = placeholders.navSearchCaption;

  block.textContent = '';

  const searchButton = document.createElement('button');
  searchButton.classList.add('nav-search__button');
  block.append(searchButton);

  searchButton.addEventListener('click', () => {
    const isExpanded = block.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeSearch(block);
    } else {
      openSearch(block);
    }
  });

  const dropdown = document.createElement('div');
  dropdown.classList.add('nav-search__dropdown');

  const dropdownContent = document.createElement('div');
  dropdownContent.classList.add('nav-search__dropdown__content');

  dropdownContent.append(form, searchCaption, tagsContent);
  dropdown.append(dropdownContent);
  block.append(dropdown);
}
