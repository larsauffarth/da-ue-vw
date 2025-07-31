/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find all the immediate card columns (should be two per row in this layout)
  const cardColumns = element.querySelectorAll(':scope .for-column-items > .page-item--column');

  // 2. Prepare the rows for the block table
  const rows = [['Cards (cards42)']]; // Header row as in the spec

  cardColumns.forEach((col) => {
    // Find the .flex-float article which contains the card content
    const article = col.querySelector('.flex-float');
    if (!article) return; // Defensive: skip if not present

    // IMAGE CELL: Get <img> inside .flex-float--image, if it exists
    let imageCell = '';
    const fig = article.querySelector('.flex-float--image');
    if (fig) {
      const img = fig.querySelector('img');
      if (img) imageCell = img;
    }

    // TEXT CELL: Compose with
    //  - h3 (title)
    //  - p(s) (description)
    //  - link/button (CTA)
    const textParts = [];
    const title = article.querySelector('h3');
    if (title) textParts.push(title);
    // Description p(s)
    const textContainer = article.querySelector('.flex-float--text');
    if (textContainer) {
      textContainer.querySelectorAll('p').forEach((p) => textParts.push(p));
      // CTA link/button
      const btnWrapper = textContainer.querySelector('.flex-float--button');
      if (btnWrapper) {
        const btn = btnWrapper.querySelector('a');
        if (btn) textParts.push(btn);
      }
    }
    // If no .flex-float--text, try any <p> or <a> left in the article
    if (!textContainer) {
      article.querySelectorAll('p').forEach((p) => textParts.push(p));
      article.querySelectorAll('a').forEach((a) => textParts.push(a));
    }

    rows.push([
      imageCell,
      textParts.length === 1 ? textParts[0] : textParts
    ]);
  });

  // 3. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
