/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, must match example exactly
  const header = ['Columns (columns39)'];

  // Find all immediate child columns
  const columns = Array.from(
    element.querySelectorAll(':scope > .row.for-column-items > .page-item--column')
  );

  // For each column, extract its main icon-box content or fallback to the column itself
  const contentCells = columns.map((col) => {
    const iconBox = col.querySelector('.icon-box');
    return iconBox ? iconBox : col;
  });

  // The first row (header) is a single cell, the second row has N cells for N columns
  const tableCells = [header, contentCells];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
