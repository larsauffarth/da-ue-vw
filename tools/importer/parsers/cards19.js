/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children of a parent matching selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Find the card items container
  const galleryItemContainer = element.querySelector('.gallery--item-container');
  if (!galleryItemContainer) return;
  const galleryList = galleryItemContainer.querySelector('.images-gallery.infinite-nodes--list');
  if (!galleryList) return;

  // All direct card elements (each card is a row)
  const cardEls = getDirectChildren(galleryList, '.image-tile.images-gallery--image.gallery--item');

  // The header row: EXACTLY one cell for the block name
  const rows = [['Cards (cards19)']];

  cardEls.forEach(card => {
    // === IMAGE ===
    const img = card.querySelector('.image-tile--image img');
    // === TEXT ===
    const infoDiv = card.querySelector('.image-tile-overlay--info');
    let textCell;
    if (infoDiv) {
      textCell = document.createElement('div');
      textCell.textContent = infoDiv.textContent.trim();
    } else {
      textCell = document.createElement('div');
    }
    // Each card row: [image cell, text cell] (2 columns)
    rows.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
