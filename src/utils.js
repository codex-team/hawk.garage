/**
 * Returns random color from predefined list
 * @return {String} color
 */
export function getRandomColor() {
  const colors = ['teal', 'green', 'purple'];

  return colors[Math.floor(Math.random() * colors.length)];
}
