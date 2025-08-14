/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (heroVideo)'];

  // 2. Background video row (figure > video)
  let videoSrcLink = '';
  let videoPoster = '';
  const figure = element.querySelector('.hero--video');
  if (figure) {
    const video = figure.querySelector('video');
    const videoSource = video.querySelector('source');
    videoSrcLink = document.createElement('a');
    videoSrcLink.textContent = videoSource.src;
    videoSrcLink.href = videoSource.src;

    if (video.getAttribute('poster')) {
      videoPoster = document.createElement('img');
      videoPoster.src = video.poster;
    }
  }

  // 3. Content row: title (h1) and smart links (as CTAs)
  const contentElements = [];

  // Find main title (h1)
  const h1 = element.querySelector('h1');
  if (h1) contentElements.push(h1);

  // Find the CTA smart links
  const smartLinks = [];
  const smartLinksContainer = element.querySelector('.hero--smart-links');
  if (smartLinksContainer) {
    const linkNodes = smartLinksContainer.querySelectorAll('a.smart-link');
    linkNodes.forEach((a) => {
      smartLinks.push(a);
    });
  }
  if (smartLinks.length) {
    // Place all CTAs in a div for grouped layout
    const ctaDiv = document.createElement('div');
    smartLinks.forEach((a) => {
      ctaDiv.appendChild(a);
    });
    contentElements.push(ctaDiv);
  }

  // Ensure at least an empty cell if no content
  const contentRow = [contentElements.length ? (contentElements.length === 1 ? contentElements[0] : contentElements) : ''];

  const consumptionWrapperIndex = element.querySelector('.consumption-wrapper--index') || '';

  // Construct the table
  const cells = [
    headerRow,
    [videoSrcLink],
    [videoPoster],
    contentRow,
    [consumptionWrapperIndex]
  ];

  // Replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
