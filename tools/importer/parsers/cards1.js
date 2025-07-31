/* global WebImporter */
export default function parse(element, { document }) {
  // Header as specified in the example
  const rows = [['Cards (cards1)']];

  // Get all card columns (should be 3)
  const columns = element.querySelectorAll('.page-item--column');
  columns.forEach(col => {
    // 1st cell: Image (img element inside .flex-float--image)
    let image = null;
    const imgEl = col.querySelector('.flex-float--image img');
    if (imgEl) image = imgEl;
    else image = document.createTextNode(''); // fallback

    // 2nd cell: Text content: title, description, CTA
    // Reference the actual DOM elements from the card
    const textContent = [];
    const title = col.querySelector('.flex-float--title');
    if (title) textContent.push(title);
    const desc = col.querySelector('.flex-float--text p');
    if (desc) textContent.push(desc);
    const cta = col.querySelector('.flex-float--button a');
    if (cta) textContent.push(cta);

    rows.push([
      image,
      textContent.length === 1 ? textContent[0] : textContent
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
