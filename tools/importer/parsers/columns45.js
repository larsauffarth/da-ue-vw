/* global WebImporter */
export default function parse(element, { document }) {
  // Safely get the main container for columns
  const outerContainer = element.querySelector('.container-fluid');
  if (!outerContainer) return;
  const row = outerContainer.querySelector('.row.for-column-items');
  if (!row) return;

  // Find all immediate .page-item--column children (should be two: text and image)
  const columns = Array.from(row.querySelectorAll(':scope > .page-item--column'));

  // Prepare array for the content cells (one for each column)
  const contentCells = [];

  // FIRST COLUMN: text block (section.flex-text)
  if (columns[0]) {
    // Try to grab the section.flex-text directly
    const section = columns[0].querySelector('section.flex-text');
    if (section) {
      contentCells.push(section);
    } else {
      // Fallback: push whole column if section is missing (edge case)
      contentCells.push(columns[0]);
    }
  } else {
    contentCells.push(document.createTextNode(''));
  }

  // SECOND COLUMN: image block (figure.image)
  if (columns[1]) {
    const figure = columns[1].querySelector('figure.image');
    if (figure) {
      contentCells.push(figure);
    } else {
      // Fallback: push whole column if figure is missing (edge case)
      contentCells.push(columns[1]);
    }
  } else {
    contentCells.push(document.createTextNode(''));
  }

  // The table header row must exactly match the example
  const headerRow = ['Columns (columns45)'];
  const cells = [headerRow, contentCells];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
