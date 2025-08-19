export default async function decorate(block) {
  const compactFormat = block.classList.contains('compact');

  const links = block.querySelectorAll('a');
  const currentPath = window.location.href;
  links.forEach((link) => {
    if (link.href.split('?')[0] === currentPath) {
      link.setAttribute('data-current', 'true');
    }
  });

  if (compactFormat) {
    const globeButton = document.createElement('button');
    const dropdown = document.createElement('div');
    dropdown.classList.add('nav-locale-switcher__dropdown');
    dropdown.append(...block.children);

    let timer;
    let isMouseOver = false;
    const hideDropdown = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!isMouseOver) {
          block.setAttribute('aria-expanded', 'false');
        }
      }, 500);
    };

    globeButton.addEventListener('click', () => {
      block.setAttribute('aria-expanded', 'true');
    });
    globeButton.addEventListener('mouseover', () => {
      isMouseOver = true;
      block.setAttribute('aria-expanded', 'true');
    });
    globeButton.addEventListener('mouseleave', () => {
      isMouseOver = false;
      hideDropdown();
    });

    dropdown.addEventListener('mouseover', () => {
      isMouseOver = true;
      clearTimeout(timer);
    });
    dropdown.addEventListener('mouseleave', () => {
      isMouseOver = false;
      hideDropdown();
    });
    block.append(globeButton, dropdown);
  }
}
