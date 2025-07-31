/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container with the card tiles
  const tilesContainer = element.querySelector('.horizontal-scroll-page-list--tiles');
  if (!tilesContainer) return;
  
  // Get all cards as anchor elements
  const cards = Array.from(tilesContainer.querySelectorAll(':scope > a.image-tile'));
  const cells = [];
  // Header row exactly as in the block name
  cells.push(['Cards (cards40)']);

  cards.forEach(card => {
    // First cell: The image (reference the <img> element)
    let image = null;
    const imageEl = card.querySelector('.image-tile--image img');
    if (imageEl) image = imageEl;
    
    // Second cell: All text content, capturing badge/date/type and title, preserving order
    const textCell = [];
    const badge = card.querySelector('.image-tile--badge');
    if (badge) {
      // Use the badge block directly, but remove any irrelevant class names
      textCell.push(badge);
    }
    const titleDiv = card.querySelector('.image-tile--title-below-image');
    if (titleDiv) {
      // Use <strong> for heading/semantic meaning as in the example
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      textCell.push(strong);
    }
    cells.push([
      image,
      textCell
    ]);
  });

  // Create the structured table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
