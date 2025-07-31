/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Locate the horizontal-scroll-page-list block (cards area)
  const cardsSection = element.querySelector('.horizontal-scroll-page-list');
  if (!cardsSection) return;

  // 2. Find the cards container
  const tilesContainer = cardsSection.querySelector('.horizontal-scroll-page-list--tiles');
  if (!tilesContainer) return;

  // 3. Get all card anchors
  const cards = Array.from(tilesContainer.querySelectorAll(':scope > a.image-tile'));

  // 4. Prepare table rows: header first
  const rows = [['Cards (cards27)']];

  // 5. For each card, extract image and text
  cards.forEach(card => {
    // Image
    let img = null;
    const imageWrap = card.querySelector('.image-tile--image');
    if (imageWrap) {
      img = imageWrap.querySelector('img');
    }

    // Card text (date and title)
    const textFragment = document.createElement('div');

    // Date (optional)
    const badgeTime = card.querySelector('.image-tile--badge time');
    if (badgeTime && badgeTime.textContent) {
      // Use a <p> element for date
      const dateP = document.createElement('p');
      dateP.textContent = badgeTime.textContent;
      textFragment.appendChild(dateP);
    }
    // Title (bold, can contain spans)
    const titleDiv = card.querySelector('.image-tile--title-below-image');
    if (titleDiv) {
      const strong = document.createElement('strong');
      // Move or append all child nodes (including text and <span>)
      while (titleDiv.firstChild) {
        strong.appendChild(titleDiv.firstChild);
      }
      textFragment.appendChild(strong);
    }

    rows.push([
      img,
      textFragment
    ]);
  });

  // 6. Build the table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
