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

/**
 * Return a function that renders a limited subset of Markdown to HTML.
 * @todo use Abstract syntax tree (AST) instead of only string manipulation
 * @returns a function that renders a limited subset of Markdown to HTML
 */
export async function getMarkdownRenderer(): Promise<(text: string) => string> {
  const { marked, Renderer } = await import("marked");
  const renderer = new Renderer();

  renderer.heading = ({ tokens, depth }) => {
    const body = renderer.parser.parseInline(tokens);

    return `<h${depth} class="text-h${depth}">${body}</h${depth}>\n`;
  };

  renderer.paragraph = ({ tokens }) => {
    const body = renderer.parser.parseInline(tokens);

    return `<p>${body}</p>\n`;
  };

  renderer.strong = ({ tokens }) => {
    const body = renderer.parser.parseInline(tokens);

    return `<strong class="text-ui-base-bold">${body}</strong>`;
  };

  renderer.code = ({ text, lang }) =>
    `<pre><code class="text-monospaced">${text}</code></pre>\n`;

  renderer.codespan = ({ text }) =>
    `<code class="text-monospaced">${text}</code>`;

  renderer.blockquote = ({ tokens }) => {
    const body = renderer.parser.parse(tokens);

    return `<blockquote class="text-blockquote">${body}</blockquote>\n`;
  };

  const sanitize = (html: string) =>
    html.replace(/<(\/?[A-Z][a-zA-Z]*)/g, '&lt;$1');

  return (text: string) => sanitize(marked.parse(text, { renderer }) as string);
}
