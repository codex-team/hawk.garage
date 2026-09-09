/**
 * Node types the walk knows how to update in place. A comment or anything else
 * is replaced instead.
 */
const REPLACEABLE_NODE_TYPES = new Set<number>([Node.ELEMENT_NODE, Node.TEXT_NODE]);

/**
 * Decide whether an existing node can be updated into the next one.
 * @param existing - node currently in the document
 * @param next - node the new markup puts in its place
 * @returns true when the existing node can stay and be updated in place
 */
function isSameKind(existing: Node, next: Node): boolean {
  if (existing.nodeType !== next.nodeType) {
    return false;
  }

  if (!REPLACEABLE_NODE_TYPES.has(existing.nodeType)) {
    return false;
  }

  if (existing.nodeType === Node.ELEMENT_NODE) {
    return (existing as Element).tagName === (next as Element).tagName;
  }

  return true;
}

/**
 * Copy attributes onto the node that stays, dropping the ones the new markup lost.
 * @param existing - element currently in the document
 * @param next - element the new markup puts in its place
 */
function morphAttributes(existing: Element, next: Element): void {
  for (const { name, value } of Array.from(next.attributes)) {
    if (existing.getAttribute(name) !== value) {
      existing.setAttribute(name, value);
    }
  }

  for (const { name } of Array.from(existing.attributes)) {
    if (!next.hasAttribute(name)) {
      existing.removeAttribute(name);
    }
  }
}

/**
 * Walk both child lists in step, keeping every node that still matches.
 *
 * Nodes are taken out of the new markup rather than copied, so the caller is
 * left holding an emptied tree.
 * @param existing - node currently in the document
 * @param next - node holding the children the document should end up with
 */
function morphChildren(existing: Node, next: Node): void {
  let existingChild = existing.firstChild;
  let nextChild = next.firstChild;

  while (nextChild) {
    const followingChild = nextChild.nextSibling;

    if (!existingChild) {
      existing.appendChild(nextChild);
    } else if (isSameKind(existingChild, nextChild)) {
      if (existingChild.nodeType === Node.TEXT_NODE) {
        if (existingChild.nodeValue !== nextChild.nodeValue) {
          existingChild.nodeValue = nextChild.nodeValue;
        }
      } else {
        morphAttributes(existingChild as Element, nextChild as Element);
        morphChildren(existingChild, nextChild);
      }

      existingChild = existingChild.nextSibling;
    } else {
      const followingExistingChild = existingChild.nextSibling;

      existing.replaceChild(nextChild, existingChild);
      existingChild = followingExistingChild;
    }

    nextChild = followingChild;
  }

  while (existingChild) {
    const followingExistingChild = existingChild.nextSibling;

    existing.removeChild(existingChild);
    existingChild = followingExistingChild;
  }
}

/**
 * Update an element's contents toward new markup, keeping the nodes that match.
 *
 * Assigning innerHTML builds every child again, which restarts the CSS animation
 * on words that are already on screen. A streamed answer mostly grows at its end,
 * so walking both trees in step leaves the words that arrived earlier untouched
 * and adds only what the last delta brought.
 * @param target - element to update
 * @param html - markup the element should end up holding
 */
export function morphHtml(target: Element, html: string): void {
  const source = target.ownerDocument.createElement('template');

  source.innerHTML = html;

  morphChildren(target, source.content);
}
