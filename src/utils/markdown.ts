/**
 * Text segment for mixed markdown/plain text with fenced code
 */
export type TextSegment = { type: 'text'; text: string };

/**
 * Single code line representation
 */
export type CodeLine = { line: number; content: string };

/**
 * Code segment for mixed markdown/plain text with fenced code
 */
export type CodeSegment = { type: 'code'; lang: string; lines: CodeLine[] };

/**
 * Union type of possible segments
 */
export type ContentSegment = TextSegment | CodeSegment;

/**
 * Split markdown into text and code segments.
 * Code segments are fenced with ```lang ... ```
 *
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
        segments.push({ type: 'text', text: before });
      }
    }

    const lines: CodeLine[] = code.replace(/\n$/, '').split('\n').map((line, i) => ({
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
    segments.push({ type: 'text', text: text.slice(lastIndex) });
  }

  if (segments.length === 0) {
    segments.push({ type: 'text', text });
  }

  return segments;
}

/**
 * Safely render a limited subset of Markdown to HTML.
 * Supports: headings, hr, blockquotes, ul/ol lists, links, bold/italic/strike, inline code.
 * Code fences should be handled separately by consumer (e.g., CodeFragment).
 * @todo use Abstract syntax tree (AST) instead of only string manipulation
 *
 * @param text - raw markdown text
 * @returns HTML string safe to inject with v-html
 */
export async function renderMarkdownAsync(): Promise<(text: string) => string> {
  const marked = await import('marked');
  return (text: string) => marked.parse(text) as string;
}
