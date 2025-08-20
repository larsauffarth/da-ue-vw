export default function decorate(block) {
  const hasVideo = block.classList.contains('herovideo');

  if (!block.querySelector(':scope > div:first-child picture') && !hasVideo) {
    block.classList.add('no-image');
  }

  if (hasVideo) {
    const videoLink = block.querySelector(':scope > div:first-child a');
    const videoSrc = videoLink?.href;
    const videoPoster = block.querySelector(':scope > div:nth-child(2) picture');
    const videoPosterSrc = videoPoster?.querySelector('img')?.src;
    const video = document.createElement('video');
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.poster = videoPosterSrc;

    const source = document.createElement('source');
    const sourceMp4 = document.createElement('source');
    const sourceWebm = document.createElement('source');
    source.src = videoSrc;
    sourceMp4.src = videoSrc;
    sourceWebm.src = videoSrc;
    sourceMp4.type = 'video/mp4';
    sourceWebm.type = 'video/webm; codecs=&quot;vp8, vorbis&quot;';

    video.append(sourceWebm, sourceMp4, source);
    videoPoster.replaceWith(video);
    videoLink.remove();

    const consumptionWrapperIndex = block.querySelector(':scope > div:nth-child(4)');
    consumptionWrapperIndex.classList.add('hero__consumption-wrapper-index');

    const links = block.querySelector(':scope > div:nth-child(3) p:has(a)');
    links.classList.add('hero__smart-links');
  }

  const links = block.querySelector('.hero__smart-links');
  const linksWrapper = document.createElement('div');
  linksWrapper.classList.add('hero__smart-links-wrapper');
  links.replaceWith(linksWrapper);

  const linksButtonWrapper = document.createElement('div');
  linksButtonWrapper.classList.add('hero__smart-links-buttons-wrapper');
  linksButtonWrapper.append(links);
  linksWrapper.append(linksButtonWrapper);

  const linksScrollWrapper = document.createElement('div');
  linksScrollWrapper.classList.add('hero__smart-links-scroll-wrapper');
  linksScrollWrapper.append(links);
  linksButtonWrapper.append(linksScrollWrapper);

  const prevButton = document.createElement('button');
  prevButton.classList.add('hero__smart-links__prev');
  const nextButton = document.createElement('button');
  nextButton.classList.add('hero__smart-links__next');
  linksButtonWrapper.prepend(prevButton);
  linksButtonWrapper.append(nextButton);

  // FIXME: Scroll behaviour should probably be more sophisticated than this
  prevButton.addEventListener('click', () => {
    linksScrollWrapper.scrollLeft -= 100;
  });

  nextButton.addEventListener('click', () => {
    linksScrollWrapper.scrollLeft += 100;
  });

  const checkIfScrollable = () => {
    if (linksScrollWrapper.scrollLeft > 0) {
      prevButton.classList.add('visible');
    } else {
      prevButton.classList.remove('visible');
    }

    if (
      (linksScrollWrapper.scrollWidth - linksScrollWrapper.scrollLeft)
      > linksScrollWrapper.clientWidth
    ) {
      nextButton.classList.add('visible');
    } else {
      nextButton.classList.remove('visible');
    }
  };
  const resizeObserver = new ResizeObserver(checkIfScrollable);
  resizeObserver.observe(linksWrapper);

  linksScrollWrapper.addEventListener('scrollend', checkIfScrollable);
}
