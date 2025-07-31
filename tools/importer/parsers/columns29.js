/* global WebImporter */
export default function parse(element, { document }) {
  // Find the smart-link-group
  const group = element.querySelector('.smart-link-group');
  let links = [];
  if (group) {
    // Get all direct <a> children (smart links)
    links = Array.from(group.querySelectorAll(':scope > a.smart-link'));
  }

  // Fallback if no links (to avoid empty row)
  if (links.length === 0) {
    links.push(document.createElement('div'));
  }

  // The header row must be an array with ONE cell only (not multiple columns!), regardless of columns
  const rows = [
    ['Columns (columns29)'], // header row, single cell
    links                 // content row, one cell per column
  ];
  
  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  element.replaceWith(table);
}
