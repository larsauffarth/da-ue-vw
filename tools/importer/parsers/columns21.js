/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns container in the given element
  const container = element.querySelector('.container-fluid .row.for-column-items');
  if (!container) return;

  // Get all column elements
  const columns = Array.from(container.children).filter(col => col.classList.contains('page-item--column'));
  if (!columns.length) return;

  // For each column, collect all relevant content (including headings, lists, etc.)
  const columnCells = columns.map(col => {
    // Collect all direct children that are not spacers
    const contentNodes = [];
    Array.from(col.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!child.classList.contains('page-row-spacer')) {
          if (child.classList.contains('page-row')) {
            // Add all .page-item children inside .page-row
            Array.from(child.children).forEach(pageItem => {
              contentNodes.push(pageItem);
            });
          } else {
            contentNodes.push(child);
          }
        }
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        // Handle stray text content
        const span = document.createElement('span');
        span.textContent = child.textContent;
        contentNodes.push(span);
      }
    });

    // For each node, replace any iframe (that is not an image) with a link
    contentNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const iframes = node.querySelectorAll ? node.querySelectorAll('iframe') : [];
        iframes.forEach(iframe => {
          const src = iframe.getAttribute('src');
          if (src) {
            const link = document.createElement('a');
            link.href = src;
            link.textContent = src;
            iframe.replaceWith(link);
          }
        });
      }
    });

    // If there is only one node, return it, else return all as an array
    if (contentNodes.length === 1) {
      return contentNodes[0];
    } else if (contentNodes.length > 1) {
      return contentNodes;
    } else {
      // fallback: empty cell
      return document.createTextNode('');
    }
  });

  // Build the table with header row as a single cell (critical fix)
  const cells = [
    ['Columns (columns21)'], // Header row: exactly one cell
    columnCells              // Content row: one cell per column
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
