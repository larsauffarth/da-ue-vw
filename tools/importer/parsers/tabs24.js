/* global WebImporter */
export default function parse(element, { document }) {
  // Collect tab labels and contents
  const tabLabels = [];
  const tabContents = [];

  // Main (active) tab from main panel
  const mainTabElem = element.querySelector('.gallery--tab');
  let mainLabel = '';
  let mainContent = null;
  if (mainTabElem) {
    const titleElem = mainTabElem.querySelector('.videos-gallery--stage h1');
    mainLabel = titleElem ? titleElem.textContent.trim() : '';
    const stage = mainTabElem.querySelector('.videos-gallery--stage');
    mainContent = stage || mainTabElem;
    if (mainLabel && mainContent) {
      tabLabels.push(mainLabel);
      tabContents.push(mainContent);
    }
  }

  // Additional tabs from tiles
  const tileElems = Array.from(element.querySelectorAll('.videos-gallery-tile'));
  tileElems.forEach(tile => {
    const labelElem = tile.querySelector('.videos-gallery-tile--title');
    const label = labelElem ? labelElem.textContent.trim() : '';
    // Only add if not duplicate label
    if (!tabLabels.includes(label)) {
      tabLabels.push(label);
      tabContents.push(tile);
    }
  });

  // Build table: header, label row, each content row with content in correct cell
  const rows = [];
  rows.push(['Tabs']);
  rows.push(tabLabels);
  for (let i = 0; i < tabContents.length; i++) {
    const row = tabLabels.map((_, j) => (i === j ? tabContents[i] : ''));
    rows.push(row);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
