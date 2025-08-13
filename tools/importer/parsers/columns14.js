/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name as in the example
  const headerRow = ['Columns (columns14)'];

  // 2. Find image (background image)
  let imageCell = null;
  // Look for any direct descendant column that contains an <img>
  const columns = element.querySelectorAll('.page-item--column');
  for (const col of columns) {
    const img = col.querySelector('img');
    if (img) {
      // Prefer to reference the full figure if present
      const figure = img.closest('figure');
      imageCell = figure || img;
      break;
    }
  }

  // If no image found, leave cell empty (edge case)
  if (!imageCell) imageCell = '';

  // 3. Find text content: headline, description, CTA
  let textCell = [];
  let title, paragraph, cta;

  // Look for the text column
  for (const col of columns) {
    const flex = col.querySelector('section.flex-text');
    if (flex) {
      // Title (first heading inside .flex-text--title or any h1-h6)
      title = flex.querySelector('.flex-text--title, h1, h2, h3, h4, h5, h6');
      // Paragraph
      paragraph = flex.querySelector('.flex-text--text p');
      // CTA button (anchor)
      cta = flex.querySelector('.flex-text--button a');
      break;
    }
  }

  if (title) textCell.push(title);
  if (paragraph) textCell.push(paragraph);
  if (cta) textCell.push(cta);

  // If nothing found, keep cell empty (edge case)
  if (textCell.length === 0) textCell = [''];

  // Construct the table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
