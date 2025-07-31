/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container-fluid then the .row.for-column-items
  const container = element.querySelector('.container-fluid');
  if (!container) return;
  const columnsRow = container.querySelector('.row.for-column-items');
  if (!columnsRow) return;

  // Get immediate columns (page-item--column) in correct order
  const columnDivs = Array.from(columnsRow.querySelectorAll(':scope > .page-item--column'));

  // For each column, find its main visible content (the first .page-row inside it)
  const columnContents = columnDivs.map(col => {
    const innerRow = col.querySelector(':scope > .page-row');
    if (innerRow) {
      return innerRow;
    }
    return col;
  });

  // --- Custom table creation to guarantee header row has only one cell ---
  // Create table element
  const table = document.createElement('table');
  // Create header row with a single th
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns41)';
  headerTr.appendChild(th);
  table.appendChild(headerTr);
  // Create content row with as many tds as columns
  const contentTr = document.createElement('tr');
  columnContents.forEach(cellContent => {
    const td = document.createElement('td');
    td.append(cellContent);
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  element.replaceWith(table);
}
