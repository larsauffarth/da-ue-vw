/* global WebImporter */
export default function parse(element, { document }) {
  // Init table with a single-column header row
  const cells = [['Cards (cards30)']];

  // Find all card columns
  const cardColumns = element.querySelectorAll(':scope > .row > .page-item--column');
  cardColumns.forEach((col) => {
    const teaser = col.querySelector('.page-item--teaser > a.teaser');
    if (!teaser) return;

    // MEDIA cell (img, video poster, or video link)
    let media = null;
    const teaserImg = teaser.querySelector('.teaser--image img');
    if (teaserImg) {
      media = teaserImg;
    } else {
      const video = teaser.querySelector('video');
      if (video && video.poster) {
        const img = document.createElement('img');
        img.src = video.poster;
        img.alt = '';
        media = img;
      } else if (video) {
        const source = video.querySelector('source');
        if (source && source.src) {
          const a = document.createElement('a');
          a.href = source.src;
          a.textContent = source.src;
          media = a;
        }
      }
    }

    // TEXT cell: title as strong, link if card is clickable
    const textParts = [];
    const teaserTitle = teaser.querySelector('.teaser--title');
    if (teaserTitle && teaserTitle.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = teaserTitle.textContent.trim();
      textParts.push(strong);
    }
    let textCell;
    if (teaser.href) {
      const a = document.createElement('a');
      a.href = teaser.href;
      textParts.forEach(part => a.appendChild(part));
      textCell = a;
    } else {
      textCell = textParts;
    }

    if (media && textCell) {
      cells.push([media, textCell]); // 2-column for card row
    }
  });

  // Create the table: first row (header) is single cell.
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
