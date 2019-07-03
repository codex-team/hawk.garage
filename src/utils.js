/**
 * Returns random color from predefined list
 * @return {String} color
 */
export function getRandomColor() {
  const colors = ['teal', 'green', 'aqua'];

  return colors[Math.floor(Math.random() * colors.length)];
}
