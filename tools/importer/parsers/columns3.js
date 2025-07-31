/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the container with columns
  const row = element.querySelector('.row.for-column-items');
  if (!row) return;
  // Get all column elements
  const columnElems = row.querySelectorAll(':scope > .page-item--column');

  // Prepare the cells array
  // Header row: exactly one column, per requirements
  const cells = [['Columns (columns3)']];

  // Extract content for each column for one content row
  const contentRow = [];
  columnElems.forEach((colElem) => {
    const textBlock = colElem.querySelector('.text-block');
    contentRow.push(textBlock ? textBlock : '');
  });
  cells.push(contentRow);

  // Build the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
