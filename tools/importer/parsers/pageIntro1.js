/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Page Intro (pageIntro1)'];

  const textEl = element.querySelector('.intro-text--text') || '';
  const tagsEl = element.querySelector('.intro-text--tags') || '';

  // Construct the table
  const cells = [
    headerRow,
    [textEl],
    [tagsEl],
  ];

  // Replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
