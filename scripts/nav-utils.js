export const isDesktop = window.matchMedia('(min-width: 1141px)');

export function closeSearch(block) {
  block.setAttribute('aria-expanded', false);
  // eslint-disable-next-line no-use-before-define
  window.removeEventListener('keydown', closeSearchOnEscape);
  // eslint-disable-next-line no-use-before-define
  document.removeEventListener('click', closeSearchOnClickOutside);
}

export function toggleAllNavSubMenus(sections, expanded = false) {
  sections.querySelectorAll('.nav-item-menu__submenu').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

export function closeSearchOnEscape(e) {
  const block = document.querySelector('header .nav-search');
  if (e.code === 'Escape') {
    closeSearch(block);
  }
}

export function closeSearchOnClickOutside(e) {
  const block = document.querySelector('header .nav-search');
  if (!block.contains(e.target)) {
    closeSearch(block);
  }
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

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
export function toggleMenu(nav, navSections, forceExpanded = null) {
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
