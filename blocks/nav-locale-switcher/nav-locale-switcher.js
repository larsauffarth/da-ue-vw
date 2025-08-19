export default async function decorate(block) {
  const links = block.querySelectorAll('a');
  const currentPath = window.location.href;
  links.forEach((link) => {
    if (link.href.split('?')[0] === currentPath) {
      link.setAttribute('data-current', 'true');
    }
  });
}
