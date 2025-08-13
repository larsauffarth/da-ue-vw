/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Search'];

  // 3. Content row: key-value properties
  const contentElements = [];

  // Find input (h1)
  const input = element.querySelector('input#query');
  if (input) contentElements.push(['placeholder'], [input.placeholder]);

  // Ensure at least an empty cell if no content
  const contentRow = [contentElements.length ? (contentElements.length === 1 ? contentElements[0] : contentElements) : ''];

  // Construct the table
  const cells = [
    headerRow,
    contentRow,
  ];

  // Replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
