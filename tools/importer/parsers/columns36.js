/* global WebImporter */
export default function parse(element, { document }) {
  // Find flex row containing the columns
  const flexRow = element.querySelector('.flex-tai--row');
  if (!flexRow) return;

  // Extract left and right columns (image and text)
  const columns = Array.from(flexRow.children);
  let leftCol = columns[0];
  let rightCol = columns[1];
  if (!leftCol || !rightCol) return;

  // Get image content for left column
  let imageContent = leftCol.querySelector('figure') || leftCol.querySelector('img') || leftCol;

  // Get text content for right column
  let textContent = rightCol.querySelector('.flex-tai--text') || rightCol;

  // Create the table with a header row that spans both columns
  const cells = [];
  // Header row: single cell for block name, will be colspan'ed by the importer/render engine
  cells.push(['Columns (columns36)']);
  // Content row: two cells, as in the design
  cells.push([imageContent, textContent]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
