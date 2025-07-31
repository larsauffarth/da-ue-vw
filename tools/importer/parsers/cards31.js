/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Turn the .document-tile.gallery--item elements into [image, text fragment] pairs
  function extractCards(container) {
    const cards = [];
    const cardNodes = container.querySelectorAll('.document-tile.gallery--item');
    cardNodes.forEach((card) => {
      // IMAGE CELL (mandatory)
      let imgEl = null;
      const imageLink = card.querySelector('.document-tile--image');
      if (imageLink) {
        imgEl = imageLink.querySelector('img');
      }
      // TEXT CELL (mandatory)
      const textContainer = card.querySelector('.document-tile--text');
      let textContentFrag = document.createElement('div');
      if (textContainer) {
        // Title
        const titleLink = textContainer.querySelector('a[href]');
        let titleNode = null;
        if (titleLink) {
          titleNode = titleLink.querySelector('.document-tile--title');
        }
        if (titleNode && titleNode.textContent.trim()) {
          // Use <strong> (matches example markdown visual weight under Cards block)
          const strong = document.createElement('strong');
          strong.textContent = titleNode.textContent.trim();
          textContentFrag.appendChild(strong);
        }
        // Description
        let descNode = null;
        if (titleLink) {
          descNode = titleLink.querySelector('.document-tile--description');
        }
        if (descNode) {
          // The description has: <time>, <span> (label), <span> (description)
          // Compose them all as a single paragraph/text block
          const descFrag = document.createElement('div');
          // Collect text parts in order
          let descText = '';
          descNode.childNodes.forEach((node, idx) => {
            if (node.nodeType === 3) {
              // Text node
              descText += node.textContent;
            } else if (node.tagName === 'TIME') {
              descText += node.textContent + ' · ';
            } else if (node.tagName === 'SPAN') {
              // Add separator if previous is not empty
              if (descText.length && !descText.trim().endsWith('·')) {
                descText += '· ';
              }
              descText += node.textContent.trim() + ' ';
            }
          });
          descFrag.textContent = descText.trim();
          textContentFrag.appendChild(descFrag);
        }
      }
      cards.push([
        imgEl,
        textContentFrag
      ]);
    });
    return cards;
  }

  // Find the gallery container (contains the cards)
  const galleryContainer = element.querySelector('.documents-gallery');
  if (!galleryContainer) return;

  // Header row: Block name exactly as in the instructions
  const headerRow = ['Cards (cards31)'];
  // Gather cards
  const cardRows = extractCards(galleryContainer);

  // Build the block table
  const cells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
