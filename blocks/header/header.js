import { loadFragment } from '../fragment/fragment.js';
import { getMetadata } from '../../scripts/aem.js';
import { closeSearch } from '../nav-search/nav-search.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1141px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navMenus = nav.querySelector('.nav-menu-items');
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, navMenus, false);
    if (isDesktop.matches) {
      nav.querySelector('.nav-root a')?.focus();
    } else {
      nav.querySelector('.nav-hamburger button')?.focus();
    }
  }
}

function closeOnClickOutside(e) {
  const nav = document.getElementById('nav');
  if (!nav.contains(e.target)) {
    const navMenus = nav.querySelector('.nav-menu-items');
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, navMenus, false);
  }
}

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

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (expanded) {
    toggleAllNavMenus(navSections, false);
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('click', closeOnClickOutside);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    document.removeEventListener('click', closeOnClickOutside);
  }
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
  hamburgerButton.addEventListener('click', () => toggleMenu(nav, navMenuItems));
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburger.classList.add('nav-hamburger');
  hamburger.append(hamburgerButton);
  nav.prepend(hamburger);

  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navMenuItems, false);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navMenuItems, false));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
