/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container
  const columnsRow = element.querySelector('.row.for-column-items');
  if (!columnsRow) return;
  // Select all direct child column elements
  const columnEls = Array.from(columnsRow.children).filter(child => child.classList.contains('page-item--column'));
  if (columnEls.length === 0) return;
  // Extract content for each column
  const cellsContent = columnEls.map(colEl => {
    Array.from(colEl.querySelectorAll('div.page-row-spacer')).forEach(spacer => spacer.remove());
    // Filter out spacers and empty content
    const mainContent = Array.from(colEl.children).filter(child => {
      return child.textContent.trim() !== '' && !child.matches('div.page-row-spacer');
    });
    if (mainContent.length === 1) return mainContent[0];
    if (mainContent.length > 1) return mainContent;
    return colEl;
  });

  // Header row: a single cell with the block name (fixes the error)
  const headerRow = ['Columns (columns18)'];

  const tableData = [
    headerRow,
    cellsContent
  ];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
