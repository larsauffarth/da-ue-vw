/* global WebImporter */
export default function parse(element, { document }) {
  // Find all immediate column items (should be two for columns2)
  const columns = Array.from(element.querySelectorAll('.page-item--column'));
  if (columns.length < 2) {
    // fallback: try to find columns by col-sm-*
    const possibleCols = Array.from(element.querySelectorAll('[class*="col-sm-"]'));
    if (possibleCols.length >= 2) {
      columns.push(...possibleCols.slice(0,2));
    } else {
      // Not enough columns found, abort
      return;
    }
  }

  // LEFT COLUMN: Get the central text block (section.flex-text)
  let leftCol = columns[0];
  let leftContent = leftCol.querySelector('section.flex-text') || leftCol;
  // RIGHT COLUMN: Get the image (figure > img)
  let rightCol = columns[1];
  let rightContent = rightCol.querySelector('figure') || rightCol;

  // Compose block table
  const headerRow = ['Columns (columns2)'];
  const contentRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  element.replaceWith(table);
}
