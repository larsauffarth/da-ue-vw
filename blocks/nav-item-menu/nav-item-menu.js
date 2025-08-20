import { buildBackButton, toggleAllNavSubMenus } from '../header/header.js';
import { fetchPlaceholders } from '../../scripts/aem.js';

function buildSubmenuFromNestedList(parentBreadcrumbText, rootLink, links, placeholders) {
  const submenu = document.createElement('div');
  submenu.classList.add('nav-item-menu__submenu');

  const breadcrumb = document.createElement('div');
  breadcrumb.classList.add('nav-item-menu__submenu__breadcrumb');
  breadcrumb.textContent = `${parentBreadcrumbText} > ${rootLink.textContent}`;

  const backButton = buildBackButton(placeholders, submenu);

  submenu.append(breadcrumb, backButton, links);

  return submenu;
}

function buildSubmenusFromNestedLists(navSection, linksContainer, rootLink, placeholders) {
  const listItemsWithNestedLists = linksContainer.querySelectorAll(':scope > div > ul > li:has(ul)');

  listItemsWithNestedLists.forEach((listItem) => {
    const link = listItem.querySelector(':scope > a');
    const list = listItem.querySelector(':scope > ul');

    link.classList.add('has-submenu');
    const submenu = buildSubmenuFromNestedList(rootLink.textContent, link, list, placeholders);
    navSection.append(submenu);

    link.addEventListener('click', (event) => {
      event.preventDefault();
      toggleAllNavSubMenus(navSection, false);
      submenu.setAttribute('aria-expanded', 'true');
    });
  });
}

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();

  block.tabindex = -1;
  const pictureContainer = block.querySelector(':scope > div:nth-child(1)');
  pictureContainer.classList.add('nav-item-menu__picture');

  const rootLinkContainer = block.querySelector(':scope > div:nth-child(2)');
  rootLinkContainer.classList.add('nav-item-menu__root');
  const rootLink = rootLinkContainer.querySelector('a');

  const linksContainer = block.querySelector(':scope > div:nth-child(3)');
  linksContainer.classList.add('nav-item-menu__links');

  const backButtonContainer = buildBackButton(placeholders, block);

  block.insertBefore(backButtonContainer, linksContainer);

  buildSubmenusFromNestedLists(block, linksContainer, rootLink, placeholders);
}
