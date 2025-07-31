/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct columns from the grid
  function getColumns(root) {
    // Find the .for-column-items > .page-item.page-item--column children
    const forColumnItems = root.querySelector('.for-column-items');
    if (!forColumnItems) return [];
    return Array.from(forColumnItems.children).filter(col => col.classList.contains('page-item--column'));
  }

  // Find the inner section with both columns
  const fullWidth = element.querySelector('.full-width-section');
  if (!fullWidth) return;
  const columns = getColumns(fullWidth);
  if (columns.length < 2) return;

  // ---- Column 1 ----
  const col1 = columns[0];
  let col1Content = [];
  const section = col1.querySelector('section.flex-text');
  if (section) {
    // heading
    const heading = section.querySelector('h2');
    if (heading) col1Content.push(heading);
    // text block
    const textBlock = section.querySelector('.flex-text--text');
    if (textBlock) col1Content.push(textBlock);
    // button
    const btn = section.querySelector('.flex-text--button');
    if (btn) col1Content.push(btn);
  }
  if (col1Content.length === 0) col1Content = '';
  if (col1Content.length === 1) col1Content = col1Content[0];

  // ---- Column 2 ----
  const col2 = columns[1];
  let col2Content = '';
  // Find the image (figure)
  const figure = col2.querySelector('figure.image');
  if (figure) {
    col2Content = figure;
  } else {
    // fallback to whole column content
    col2Content = col2;
  }

  // Table header must match **exactly**
  const rows = [
    ['Columns (columns35)'],
    [col1Content, col2Content]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
