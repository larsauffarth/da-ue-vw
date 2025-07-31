/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tile-section root in the element
  const tileSection = element.querySelector('.tile-section');
  if (!tileSection) return;

  // Find the columns row
  const columnsRow = tileSection.querySelector('.row.for-column-items');
  if (!columnsRow) return;

  // Find all immediate column elements in the columns row
  const columnEls = columnsRow.querySelectorAll(':scope > .page-item--column');

  // Prepare the header row
  const headerRow = ['Columns (columns17)'];

  // Prepare the columns cells
  const contentRow = [];

  columnEls.forEach((col) => {
    // Try to extract the column's main content
    // Look for the first .page-row.is-nth-1 inside the column
    let mainRow = col.querySelector('.page-row.is-nth-1');
    let mainContent = null;
    if (mainRow) {
      // Usually the first child is the actual content wrapper
      // Use the first real content child inside mainRow
      // Get all direct children of mainRow that aren't spacers
      const children = Array.from(mainRow.children).filter(child => !child.classList.contains('page-row-spacer'));
      if (children.length > 0) {
        mainContent = children[0];
      } else {
        mainContent = mainRow;
      }
    } else {
      // Fallback: try to use the first non-spacer child of col
      const children = Array.from(col.children).filter(child => !child.classList.contains('page-row-spacer'));
      if (children.length > 0) {
        mainContent = children[0];
      } else {
        mainContent = col;
      }
    }
    contentRow.push(mainContent);
  });

  // Compose the table data
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
