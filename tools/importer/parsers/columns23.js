/* global WebImporter */
export default function parse(element, { document }) {
  // Get the container
  const container = element.querySelector('.container-fluid');
  if (!container) return;
  // Get the infobox section
  const infoboxSection = container.querySelector('.tile-section.-infobox');
  if (!infoboxSection) return;
  // Get both columns
  const cols = infoboxSection.querySelectorAll('.for-column-items > .page-item--column');
  if (cols.length < 2) return;
  // ========== COLUMN 1: Medienkontakte ==========
  const col1 = cols[0];
  const col1Content = [];
  // Heading (h2)
  const h2_1 = col1.querySelector('h2');
  if (h2_1) col1Content.push(h2_1);
  // Contacts list
  const contactsGroup = col1.querySelector('.media-contact-group');
  if (contactsGroup) col1Content.push(contactsGroup);
  // 'Alle Medienkontakte' link
  const allContactsBlock = col1.querySelector('.page-item--text .text-block');
  if (allContactsBlock) col1Content.push(allContactsBlock);
  // ========== COLUMN 2: Corporate Design Portal ==========
  const col2 = cols[1];
  const col2Content = [];
  // Heading (h2)
  const h2_2 = col2.querySelector('h2');
  if (h2_2) col2Content.push(h2_2);
  // Image and description
  const flex = col2.querySelector('.flex-float--text-and-image');
  if (flex) {
    // Figure (image)
    const figure = flex.querySelector('figure');
    if (figure) col2Content.push(figure);
    // Text block with description and link
    const textBlock = flex.querySelector('.flex-float--text.text-block');
    if (textBlock) col2Content.push(textBlock);
  }
  // ========== Compose the block table ==========
  const headerRow = ['Columns (columns23)'];
  const contentRow = [col1Content, col2Content];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
