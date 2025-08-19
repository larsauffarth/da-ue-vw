export default function decorate(block) {
  const tags = block.querySelector('button');
  block.textContent = '';

  const searchButton = document.createElement('button');
  block.append(searchButton);
}
