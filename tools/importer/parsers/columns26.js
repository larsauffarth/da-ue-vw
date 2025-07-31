/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the main two column blocks
  const columns = Array.from(element.querySelectorAll(':scope .row.for-column-items > .page-item--column'));
  // Defensive: ensure two columns
  let leftCol = columns[0];
  let rightCol = columns[1];
  // --- LEFT COLUMN: QUOTE ---
  // Find the quote container (entire left card)
  let leftCell = null;
  if (leftCol) {
    // Prefer figure.quote-container
    const quoteFigure = leftCol.querySelector('figure.quote-container');
    leftCell = quoteFigure || leftCol;
  }

  // --- RIGHT COLUMN: Finanzbericht + Aktien ---
  let rightCellContent = [];
  if (rightCol) {
    // Find the Finanzbericht (article.flex-float)
    const report = rightCol.querySelector('article.flex-float');
    if (report) rightCellContent.push(report);
    // Find the Aktien section (.shares-box)
    const shares = rightCol.querySelector('.shares-box');
    if (shares) rightCellContent.push(shares);
    // If both missing, use the column as-is
    if (!report && !shares) rightCellContent = [rightCol];
  }

  // Compose table rows
  const headerRow = ['Columns (columns26)'];
  const bodyRow = [leftCell, rightCellContent.length === 1 ? rightCellContent[0] : rightCellContent];

  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow
  ], document);

  element.replaceWith(block);
}
