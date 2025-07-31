/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flex row, which should have two direct children: image and text
  const flexRow = element.querySelector('.flex-tai--row');
  if (!flexRow) return;

  // Get the two columns: image container and text block
  let imageCol = flexRow.querySelector('.flex-tai--image-container');
  let textCol = flexRow.querySelector('.flex-tai--text');

  // Defensive: If columns are missing, just use what's present
  const secondRow = [];
  if (textCol) secondRow.push(textCol);
  if (imageCol) secondRow.push(imageCol);
  if (secondRow.length === 0) return;

  // Compose the cells array
  const cells = [
    ['Columns (columns44)'],
    secondRow
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
