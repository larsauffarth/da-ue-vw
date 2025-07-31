/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tiles container with all cards
  const tilesContainer = element.querySelector('.horizontal-scroll-page-list--tiles');
  if (!tilesContainer) return;
  const cardLinks = Array.from(tilesContainer.querySelectorAll(':scope > a.imageless-tile'));

  // Table header: match the block name as in the example
  const rows = [['Cards']];

  cardLinks.forEach((card) => {
    // Badge: contains the date and label
    const badge = card.querySelector('.imageless-tile--badge .badge');
    let badgeText = '';
    if (badge) {
      const time = badge.querySelector('time');
      const span = badge.querySelector('span');
      let pieces = [];
      if (time && time.textContent.trim()) {
        pieces.push(time.textContent.trim());
      }
      if (span && span.textContent.trim()) {
        pieces.push(span.textContent.trim());
      }
      badgeText = pieces.join(' · ');
    }
    // Title: the headline text
    const titleDiv = card.querySelector('.imageless-tile--title');
    const cardText = titleDiv ? titleDiv.textContent.trim() : '';
    // Compose content in fragment (reference existing elements for future extensibility)
    const container = document.createElement('div');
    if (badgeText) {
      const strong = document.createElement('strong');
      strong.textContent = badgeText;
      container.appendChild(strong);
      container.appendChild(document.createElement('br'));
    }
    if (cardText) {
      container.appendChild(document.createTextNode(cardText));
    }
    rows.push([container]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
