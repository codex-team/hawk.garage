import { describe, expect, it } from 'vitest';
import { morphHtml } from './morphHtml';

/**
 * Build an element holding a fragment of markup.
 * @param html - markup to start from
 * @returns element holding it
 */
function host(html: string): HTMLElement {
  const element = document.createElement('div');

  element.innerHTML = html;

  return element;
}

describe('morphHtml', () => {
  it('keeps the nodes that a growing answer did not touch', () => {
    const grown = ['Hello', 'world', 'again'];
    const element = host('<p><span>Hello</span> <span>world</span></p>');
    const paragraph = element.firstElementChild;
    const [hello, world] = Array.from(element.querySelectorAll('span'));

    morphHtml(element, `<p>${grown.map(word => `<span>${word}</span>`).join(' ')}</p>`);

    expect(element.firstElementChild).toBe(paragraph);
    expect(element.querySelectorAll('span')[0]).toBe(hello);
    expect(element.querySelectorAll('span')[1]).toBe(world);
    expect(element.querySelectorAll('span')).toHaveLength(grown.length);
  });

  it('reaches the same markup as assigning innerHTML would', () => {
    const element = host('<p>one</p><p>two</p>');
    const html = '<h2>title</h2><p>one</p><ul><li>item</li></ul>';

    morphHtml(element, html);

    expect(element.innerHTML).toBe(html);
  });

  it('updates text in place rather than replacing its node', () => {
    const element = host('<p>draft</p>');
    const text = element.firstElementChild?.firstChild;

    morphHtml(element, '<p>final</p>');

    expect(element.firstElementChild?.firstChild).toBe(text);
    expect(element.textContent).toBe('final');
  });

  it('replaces a node whose tag changed, as a closing emphasis does', () => {
    const element = host('<p><span>bold</span></p>');
    const span = element.querySelector('span');

    morphHtml(element, '<p><strong>bold</strong></p>');

    expect(element.querySelector('span')).toBeNull();
    expect(element.querySelector('strong')).not.toBe(span);
    expect(element.textContent).toBe('bold');
  });

  it('drops nodes the new markup no longer has', () => {
    const element = host('<p>one</p><p>two</p><p>three</p>');

    morphHtml(element, '<p>one</p>');

    expect(element.children).toHaveLength(1);
    expect(element.textContent).toBe('one');
  });

  it('brings attributes across and removes the ones that went', () => {
    const element = host('<a href="/old" class="link" title="gone">go</a>');
    const anchor = element.firstElementChild;

    morphHtml(element, '<a href="/new" class="link">go</a>');

    expect(element.firstElementChild).toBe(anchor);
    expect(anchor?.getAttribute('href')).toBe('/new');
    expect(anchor?.hasAttribute('title')).toBe(false);
  });
});
