/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate child by class name
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // Find main two columns
  const pageHeadContainer = element.querySelector('.page-head-container.-with-image');
  if (!pageHeadContainer) return;
  const leftCol = getChildByClass(pageHeadContainer, 'page-head-container--text');
  const rightCol = getChildByClass(pageHeadContainer, 'page-head-container--image');

  const leftCell = leftCol || document.createElement('div');
  let rightCell = document.createElement('div');
  if (rightCol) {
    rightCell = rightCol.querySelector('figure') || rightCol;
  }

  // Compose table as rows, but fix header row to span all columns after creation
  const cells = [
    ['Columns (columns11)'], // header row: single column
    [leftCell, rightCell]    // content row: two columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Fix header: set colspan so it spans all content columns
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
