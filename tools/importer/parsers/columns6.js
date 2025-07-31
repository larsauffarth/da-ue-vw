/* global WebImporter */
export default function parse(element, { document }) {
  // Find main flex-tai--row (contains columns)
  const flexRow = element.querySelector('.flex-tai--row');
  if (!flexRow) return;

  // Find the image and text columns (order agnostic)
  const children = Array.from(flexRow.children);
  let imageCol = null;
  let textCol = null;
  children.forEach((child) => {
    if (child.classList.contains('flex-tai--image-container')) {
      imageCol = child;
    } else if (child.classList.contains('flex-tai--text')) {
      textCol = child;
    }
  });

  // If one of the columns is missing, use empty div
  const cols = [textCol || document.createElement('div'), imageCol || document.createElement('div')];

  // Build the block table
  const cells = [
    ['Columns (columns6)'],
    cols
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
