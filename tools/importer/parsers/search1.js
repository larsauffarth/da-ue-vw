/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Search (search1)'];

  // Construct the table
  const cells = [
    headerRow,
  ];

  // Replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
