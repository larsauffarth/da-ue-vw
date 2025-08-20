import { loadFragment } from '../fragment/fragment.js';
import { getMetadata } from '../../scripts/aem.js';
import { closeSearch, toggleMenu } from '../../scripts/nav-utils.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1141px)');

export function toggleAllNavSubMenus(sections, expanded = false) {
  sections.querySelectorAll('.nav-item-menu__submenu').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavMenus(sections, expanded = false) {
  sections.querySelectorAll('.nav-item-menu').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
  toggleAllNavSubMenus(sections, expanded);
}

export function buildBackButton(placeholders, navSection) {
  const backButtonContainer = document.createElement('div');
  const backButton = document.createElement('button');
  backButtonContainer.append(backButton);
  backButtonContainer.classList.add('nav-item-menu__back');
  const backButtonContent = document.createElement('span');
  backButtonContent.textContent = placeholders.navSubmenuBack || 'Back';
  backButton.append(backButtonContent);

  backButton.addEventListener('click', () => {
    navSection.setAttribute('aria-expanded', 'false');
  });

  return backButtonContainer;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const currentUrl = window.location.href;
  nav.querySelectorAll('a').forEach((link) => {
    if (currentUrl === link.href) {
      link.setAttribute('data-current', 'true');
    }
  });

  const navBrand = nav.querySelector('[data-nav-role="brand"]');
  navBrand.classList.add('nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navRoot = nav.querySelector('[data-nav-role="root"]');
  navRoot.classList.add('nav-root');

  const navTools = nav.querySelector('[data-nav-role="tools"]');
  navTools.classList.add('nav-tools');

  const navExtras = nav.querySelector('[data-nav-role="extras"]');
  navExtras.classList.add('nav-extras');

  const navMenuItems = nav.querySelector('[data-nav-role="menu-items"]');
  navMenuItems.classList.add('nav-menu-items');
  if (navRoot && navMenuItems) {
    const navMenuItemsItems = navMenuItems.querySelectorAll('.nav-item-menu');
    navRoot.querySelectorAll('li > a').forEach((link, index) => {
      const navSection = navMenuItemsItems[index];

      const hoverListener = () => {
        if (!isDesktop.matches) {
          return;
        }
        if (nav.getAttribute('aria-expanded') === 'true') {
          toggleAllNavMenus(nav, false);
          navSection.setAttribute('aria-expanded', 'true');
          navSection.focus();
        }
      };
      link.addEventListener('mouseover', hoverListener);

      link.addEventListener('click', (event) => {
        closeSearch(nav.querySelector('.nav-search'));
        nav.setAttribute('aria-expanded', 'true');
        const expanded = navSection?.getAttribute('aria-expanded') === 'true';
        if (!expanded) {
          event.preventDefault();
          toggleAllNavMenus(nav, false);
        }
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        navSection.focus();
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.addEventListener('click', () => toggleMenu(nav, navMenuItems, isDesktop));
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburger.classList.add('nav-hamburger');
  hamburger.append(hamburgerButton);
  nav.prepend(hamburger);

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navMenuItems, false);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navMenuItems, isDesktop, false));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
