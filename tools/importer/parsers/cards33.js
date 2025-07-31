/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as required in example
  const headerRow = ['Cards (cards33)'];
  const rows = [headerRow];

  // 2. Select all direct child masonry--item elements (one per card)
  const cards = element.querySelectorAll(':scope > .masonry--item');

  cards.forEach(card => {
    // Each card is <div class="masonry--item"> with <article class="social-wall-card">
    const link = card.querySelector('a.social-wall-card--link');
    if (!link) return; // skip if no content

    // --- IMAGE CELL ---
    let imgCell = null;
    const croppedImage = link.querySelector('.cropped-image');
    if (croppedImage) {
      const img = croppedImage.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // --- TEXT CELL ---
    // Compose content: social label (heading) + text (paragraph)
    const content = link.querySelector('.social-wall-card--content');
    let cellContent = [];
    if (content) {
      // Label
      const label = content.querySelector('.social-wall-card--label');
      if (label) {
        // Remove icon visually (for heading text only)
        const labelClone = label.cloneNode(true);
        const icon = labelClone.querySelector('.social-wall-card--icon');
        if (icon) icon.remove();
        // Concatenate all text in label
        const labelText = labelClone.textContent.trim();
        if (labelText) {
          const strong = document.createElement('strong');
          strong.textContent = labelText;
          cellContent.push(strong);
        }
      }
      // Post text
      const text = content.querySelector('.social-wall-card--text');
      if (text) {
        // Add line break if there was a label/heading
        if (cellContent.length > 0) cellContent.push(document.createElement('br'));
        cellContent.push(text);
      }
    }
    // Ensure at least an empty text node in cell if nothing found
    if (!cellContent.length) cellContent = [''];
    rows.push([imgCell, cellContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
