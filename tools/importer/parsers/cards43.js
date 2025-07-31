/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card columns in the container
  const cardColumns = element.querySelectorAll('.page-item.page-item--column');

  const rows = [];
  // Header row as in the example
  rows.push(['Cards (cards43)']);

  cardColumns.forEach((col) => {
    // Find the quotation block inside this column
    const quotation = col.querySelector('.page-item--quotation');
    if (!quotation) return;
    const figure = quotation.querySelector('figure.quote-container');
    if (!figure) return;

    // IMAGE CELL: prefer the .quote--image .cropped-image (portrait)
    let imageCell = null;
    const croppedImage = figure.querySelector('.quote--image .cropped-image');
    if (croppedImage) {
      imageCell = croppedImage;
    } else {
      // fallback: .quote-container--image .cropped-image (wider aspect)
      const fallback = figure.querySelector('.quote-container--image .cropped-image');
      if (fallback) imageCell = fallback;
    }
    // If still null, fallback to whatever image is available
    if (!imageCell) {
      const img = figure.querySelector('img');
      if (img) imageCell = img;
    }
    if (!imageCell) {
      imageCell = document.createTextNode('');
    }

    // TEXT CELL: contains blockquote text and figcaption (author/role)
    // Use the blockquote node and figcaption node directly from the DOM, not clones
    const blockquote = figure.querySelector('blockquote');
    const figcaption = figure.querySelector('figcaption');
    // Compose text cell: blockquote followed by author/role
    const content = [];
    if (blockquote) {
      // Remove the .quote--image from the blockquote if present
      const imgInBlock = blockquote.querySelector('.quote--image');
      if (imgInBlock) imgInBlock.remove();
      content.push(blockquote);
    }
    if (figcaption) {
      content.push(figcaption);
    }
    rows.push([imageCell, content]);
  });

  // Build the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
