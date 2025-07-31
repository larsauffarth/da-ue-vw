/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .topic-list section inside the element
  const topicList = element.querySelector('.topic-list');
  if (!topicList) return;

  // Find the ul, and get all direct li children
  const ul = topicList.querySelector('ul');
  if (!ul) return;
  const lis = Array.from(ul.children).filter(el => el.tagName === 'LI');
  if (lis.length === 0) return;

  // As visualized: split into two columns, evenly split
  const splitPoint = Math.ceil(lis.length / 2);
  // NOTE: We reference the original <li> DOM nodes directly
  const leftLis = lis.slice(0, splitPoint);
  const rightLis = lis.slice(splitPoint);

  // Create new <ul> for each column (must use reference, not clone)
  const ulLeft = document.createElement('ul');
  leftLis.forEach(li => ulLeft.appendChild(li));
  const ulRight = document.createElement('ul');
  rightLis.forEach(li => ulRight.appendChild(li));

  // Assemble table as per required block structure
  const headerRow = ['Columns (columns10)'];
  const contentRow = [ulLeft, ulRight];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the entire topicList section with the block table
  topicList.replaceWith(table);
}
