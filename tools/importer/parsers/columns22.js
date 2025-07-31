/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block
  const tileSection = element.querySelector('.tile-section');
  if (!tileSection) return;
  const columnsRow = tileSection.querySelector('.row.for-column-items');
  if (!columnsRow) return;
  // Get all columns
  const columns = Array.from(columnsRow.children).filter(child => child.classList.contains('page-item--column'));
  // Gather content for each column
  const columnCells = columns.map((col) => {
    const wrapper = document.createElement('div');
    Array.from(col.children).forEach(child => {
      if (!child.classList.contains('page-row-spacer')) {
        wrapper.appendChild(child);
      }
    });
    return wrapper;
  });
  // Header row: match number of columns
  const headerRow = ['Columns (columns22)'];
  while (headerRow.length < columnCells.length) {
    headerRow.push('');
  }
  const cells = [headerRow, columnCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
