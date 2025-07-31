/* global WebImporter */
export default function parse(element, { document }) {
  // Find columns: .page-item--column
  const columns = Array.from(element.querySelectorAll('.page-item--column'));
  if (columns.length === 0) return;

  // Gather the content blocks for each column
  const contentRow = columns.map(col => {
    const content = col.querySelector('.quicklink-list, .appointments-list');
    return content || col;
  });

  // The header row should be a single cell (array with one string), per the markdown example
  // The second row should contain one cell per column
  const cells = [];
  cells.push(['Columns (columns34)']);
  cells.push(contentRow);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // After table creation, manually set the colspan of the header cell if table has multiple columns
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && contentRow.length > 1) {
    const th = headerRow.querySelector('th');
    if (th) {
      th.setAttribute('colspan', String(contentRow.length));
    }
  }

  // Replace the original element
  element.replaceWith(table);
}
