/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the container with all cards
  const tilesContainer = element.querySelector('.horizontal-scroll-page-list--tiles');
  if (!tilesContainer) return;
  const cards = Array.from(tilesContainer.querySelectorAll(':scope > a.image-tile'));

  // Prepare rows: first row is always header
  const rows = [['Cards (cards32)']];

  cards.forEach(card => {
    // IMAGE (first cell): get the <img> element directly
    let img = null;
    const imgContainer = card.querySelector('.image-tile--image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    // TEXT (second cell): Compose from date (if present) and title (always present). All text as proper elements.
    const textContent = [];
    // Date (in .badge > time) as <p>
    const timeEl = card.querySelector('.image-tile--badge time');
    if (timeEl && timeEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = timeEl.textContent.trim();
      textContent.push(p);
    }
    // Title (as <strong> block for semantic focus)
    const titleDiv = card.querySelector('.image-tile--title-below-image');
    if (titleDiv && titleDiv.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      textContent.push(strong);
    }
    // No description in these cards, so only date + title
    rows.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
