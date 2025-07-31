/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must exactly match block name
  const headerRow = ['Hero (hero20)'];

  // Row 2: background image (none in this HTML)
  const row2 = [''];

  // Row 3: Title (h2) and CTA (link), preserving original elements
  const flexText = element.querySelector('.flex-text');
  const contentEls = [];
  if (flexText) {
    // Title (usually h2)
    const title = flexText.querySelector('.flex-text--title');
    if (title) contentEls.push(title);
    // CTA button (if present)
    const buttonDiv = flexText.querySelector('.flex-text--button');
    if (buttonDiv) {
      const btn = buttonDiv.querySelector('a');
      if (btn) contentEls.push(btn);
    }
  }
  const row3 = [contentEls];

  // Compose the table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row2,
    row3
  ], document);
  element.replaceWith(table);
}
