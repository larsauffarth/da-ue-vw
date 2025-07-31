/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the columns row
  const row = element.querySelector('.row.for-column-items');
  if (!row) return;
  // 2. Gather the direct column children in order
  const columns = Array.from(row.children).filter(col => col.classList.contains('page-item--column'));

  // 3. Create the table header: must match exactly the example
  const headerRow = ['Columns (columns15)'];

  // 4. Build the columns array for the second row, referencing existing elements
  // For each column, use the meaningful content inside the first '.page-row.is-nth-1' child
  const columnsRow = columns.map(col => {
    const mainRow = col.querySelector('.page-row.is-nth-1');
    if (!mainRow) return document.createTextNode('');
    // Usually the content lives inside a page-item, but it may not always
    // We'll collect all direct children of mainRow
    const items = Array.from(mainRow.children);
    if (items.length === 1) {
      // Use that element
      return items[0];
    } else if (items.length > 1) {
      // If more than one, include all as an array
      return items;
    }
    // If no child, just return mainRow itself
    return mainRow;
  });

  // 5. Build the table
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
