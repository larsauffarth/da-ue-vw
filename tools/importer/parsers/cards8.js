/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as in the example
  const headerRow = ['Cards (cards8)'];
  const rows = [];
  // Find all card elements
  const cards = element.querySelectorAll('.document-tile');
  cards.forEach(card => {
    // First column: image (reference only the existing <img> element)
    let imageEl = null;
    const imgContainer = card.querySelector('.document-tile--image');
    if (imgContainer) {
      imageEl = imgContainer.querySelector('img');
    }
    // Second column: gather all relevant text content from .document-tile--text
    // Reference the .document-tile--text element directly, but remove interactive button controls
    let textContent = null;
    const textNode = card.querySelector('.document-tile--text');
    if (textNode) {
      // Remove .document-tile--buttons, .share-button--popover-content, etc. in-place (do not clone)
      const buttons = textNode.querySelectorAll('.document-tile--buttons, .share-button--popover-content');
      buttons.forEach(b => b.remove());
      textContent = textNode;
    }
    rows.push([
      imageEl,
      textContent
    ]);
  });
  // Combine into table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace in DOM
  element.replaceWith(table);
}
