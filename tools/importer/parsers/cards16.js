/* global WebImporter */
export default function parse(element, { document }) {
  // Build header
  const headerRow = ['Cards (cards16)'];
  const rows = [headerRow];

  // Each card is an image-tile direct child
  const cards = Array.from(element.querySelectorAll(':scope > .image-tile'));
  cards.forEach(card => {
    // 1. IMAGE: Try .image-tile--image > any <img>
    let img = card.querySelector('.image-tile--image img');
    // 2. TEXT: All text content in .image-tile-overlay--info (may contain markup such as <span>)
    let info = card.querySelector('.image-tile-overlay--info');
    let textCell;
    if (info) {
      // Retain element - it may contain spans or formatting
      textCell = info;
    } else {
      // Fallback: try to get any text from overlay
      const overlay = card.querySelector('.image-tile-overlay');
      if (overlay) {
        textCell = document.createElement('div');
        textCell.textContent = overlay.textContent.trim();
      } else {
        // If nothing, use empty string
        textCell = '';
      }
    }
    // Add as a row: [image, text block]
    rows.push([img, textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
