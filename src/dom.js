/**
 * Ensure DOM node located in visible area
 * @param {object} element - the DOM node
 */
export function ensureVisible(element) {
  const rect = element.getBoundingClientRect();
  if (rect.top < 0) {
    element.scrollIntoView({
      block: 'start', inline: 'nearest', behavior: 'smooth'});
  } else if (rect.bottom > window.innerHeight) {
    element.scrollIntoView({
      block: 'end', inline: 'nearest', behavior: 'smooth'});
  }
}
