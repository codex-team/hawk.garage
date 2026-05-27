/**
 * Text segment for mixed markdown/plain text with fenced code
 */
export type TextSegment = { type: 'text';
  text: string; };

/**
 * Single code line representation
 */
export type CodeLine = { line: number;
  content: string; };

/**
 * Code segment for mixed markdown/plain text with fenced code
 */
export type CodeSegment = { type: 'code';
  lang: string;
  lines: CodeLine[]; };

/**
 * Union type of possible segments
 */
export type ContentSegment = TextSegment | CodeSegment;

/**
 * Split markdown into text and code segments.
 * Code segments are fenced with ```lang ... ```
 * @param source - markdown text with fenced code blocks
 * @returns array of segments to render
 */
export function splitTextAndCodeSegments(source: string | undefined | null): ContentSegment[] {
  const text = source || '';
  const segments: ContentSegment[] = [];
  const fenceRe = /```([\w+-]+)?\r?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRe.exec(text)) !== null) {
    const [full, lang, code] = match;
    const start = match.index;

    if (start > lastIndex) {
      const before = text.slice(lastIndex, start);

      if (before) {
        segments.push({ type: 'text',
          text: before });
      }
    }

    const lines: CodeLine[] = code.trimEnd().replace(/\n$/, '').split('\n')
      .map((line, i) => ({
        line: i + 1,
        content: line,
      }));

    segments.push({
      type: 'code',
      lang: lang || 'plaintext',
      lines,
    });

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text',
      text: text.slice(lastIndex) });
  }

  if (segments.length === 0) {
    segments.push({ type: 'text',
      text });
  }

  return segments;
}

import { escape } from '../utils';

/**
 * Return a function that renders a limited subset of Markdown to HTML.
 * @todo use Abstract syntax tree (AST) instead of only string manipulation
 * @returns a function that renders a limited subset of Markdown to HTML
 */
export async function getMarkdownRenderer(): Promise<(text: string) => string> {
  const { marked, Renderer } = await import('marked');

  const renderer = new Renderer();

  const headingClassMap: Record<number, string> = {
    1: 'text-h1',
    2: 'text-h2',
    3: 'text-h3',
  };

  renderer.heading = ({ tokens, depth }) => {
    const text = marked.Parser.parseInline(tokens);
    const cls = headingClassMap[depth] || 'text-h3';

    return `<h${depth} class="${cls}">${text}</h${depth}>`;
  };

  renderer.paragraph = ({ tokens }) => {
    return `<p class="text-p">${marked.Parser.parseInline(tokens)}</p>`;
  };

  renderer.blockquote = ({ tokens }) => {
    return `<blockquote class="text-blockquote">\n${marked.Parser.parse(tokens)}\n</blockquote>\n`;
  };

  renderer.codespan = ({ text }) => {
    return `<code class="text-monospaced">${text}</code>`;
  };

  /**
   * Return a function that renders a limited subset of Markdown to HTML.
   * @param text - raw markdown text
   * @returns HTML string safe to inject with v-html
   */
  return (text: string) => marked.parse(escape(text), { renderer }) as string;
}
