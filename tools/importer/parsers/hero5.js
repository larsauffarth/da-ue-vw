/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero5)'];

  // 2. Background image row (figure > img)
  let imgEl = null;
  const figure = element.querySelector('.hero--image');
  if (figure) {
    imgEl = figure.querySelector('img');
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Content row: title (h1) and smart links (as CTAs)
  const contentElements = [];

  // Find main title (h1)
  const h1 = element.querySelector('h1');
  if (h1) contentElements.push(h1);

  // Find the CTA smart links
  const smartLinks = [];
  const smartLinksContainer = element.querySelector('.hero--smart-links');
  if (smartLinksContainer) {
    const linkNodes = smartLinksContainer.querySelectorAll('a.smart-link');
    linkNodes.forEach((a) => {
      smartLinks.push(a);
    });
  }
  if (smartLinks.length) {
    // Place all CTAs in a div for grouped layout
    const ctaDiv = document.createElement('div');
    smartLinks.forEach((a) => {
      ctaDiv.appendChild(a);
    });
    contentElements.push(ctaDiv);
  }

  // Ensure at least an empty cell if no content
  const contentRow = [contentElements.length ? (contentElements.length === 1 ? contentElements[0] : contentElements) : ''];

  // Construct the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
