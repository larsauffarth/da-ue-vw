/* global WebImporter */
export default function parse(element, { document }) {
  // Find the infobox section
  const infobox = element.querySelector('.tile-section.-infobox');
  if (!infobox) return;

  // Find the columns wrapper
  const columnsWrapper = infobox.querySelector('.for-column-items');
  if (!columnsWrapper) return;

  // Get all columns
  const columns = Array.from(columnsWrapper.children).filter(col => col.classList.contains('page-item--column'));

  // For each column, extract the main content element (the content block inside the column)
  const columnContents = columns.map(col => {
    // Find first .page-row.is-nth-1 in column
    const pageRow = col.querySelector(':scope > .page-row.is-nth-1');
    if (pageRow) {
      // Find first .page-item child
      const item = pageRow.querySelector(':scope > .page-item');
      if (item) return item;
    }
    // fallback: return the column itself
    return col;
  });

  // If for some reason we didn't get two columns, abort
  if (columnContents.length < 2) return;

  // Compose the table:
  // Header row: one cell only (as per the example)
  // Second row: an array with a cell for each column's content
  const cells = [
    ['Columns (columns7)'],
    columnContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
