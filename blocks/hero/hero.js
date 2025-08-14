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
  }
}
