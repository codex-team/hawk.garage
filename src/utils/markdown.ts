/**
 * Text segment for mixed markdown/plain text with fenced code
 */
export type TextSegment = {
  type: 'text';
  text: string;
};

/**
 * Single code line representation
 */
export type CodeLine = {
  line: number;
  content: string;
};

/**
 * Code segment for mixed markdown/plain text with fenced code
 */
export type CodeSegment = {
  type: 'code';
  lang: string;
  lines: CodeLine[];
};

/**
 * Union type of possible segments
 */
export type ContentSegment = TextSegment | CodeSegment;

type MarkdownSourceSegment = ContentSegment & {
  source: string;
};

/**
 * Rendered Markdown or code block for incremental display.
 */
export type MarkdownNode = {
  key: number;
  type: 'text';
  html: string;
} | (CodeSegment & {
  key: number;
});

type MarkdownNodeState = MarkdownNode & {
  source: string;
};

/**
 * Maintains rendered Markdown nodes while text is appended.
 */
export interface MarkdownStreamRenderer {
  /** Append a text fragment and return the current rendered nodes. */
  append(delta: string): MarkdownNode[];
  /** Finalize the current rendered nodes without replacing them. */
  finish(): MarkdownNode[];
}

function createCodeSegment(lang: string | undefined, code: string, source: string): MarkdownSourceSegment {
  const lines: CodeLine[] = code.trimEnd().replace(/\n$/, '')
    .split('\n')
    .map((line, index) => ({
      line: index + 1,
      content: line,
    }));

  return {
    type: 'code',
    lang: lang || 'plaintext',
    lines,
    source,
  };
}

function splitMarkdownSourceSegments(source: string | undefined | null): MarkdownSourceSegment[] {
  const text = source || '';
  const segments: MarkdownSourceSegment[] = [];
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
          text: before,
          source: before });
      }
    }

    segments.push(createCodeSegment(lang, code, full));
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    const tail = text.slice(lastIndex);

    segments.push({ type: 'text',
      text: tail,
      source: tail });
  }

  if (segments.length === 0) {
    segments.push({ type: 'text',
      text,
      source: text });
  }

  return segments;
}

/**
 * Split markdown into text and code segments.
 * Code segments are fenced with ```lang ... ```
 * @param source - markdown text with fenced code blocks
 * @returns array of segments to render
 */
export function splitStringIntoTextAndCodeSegments(source: string | undefined | null): ContentSegment[] {
  return splitMarkdownSourceSegments(source).map((segment): ContentSegment => {
    if (segment.type === 'code') {
      return {
        type: 'code',
        lang: segment.lang,
        lines: segment.lines,
      };
    }

    return {
      type: 'text',
      text: segment.text,
    };
  });
}

import { escape } from '../utils';
import DOMPurify from 'dompurify';

/**
 * Return a function that renders a limited subset of Markdown to HTML.
 * @todo use Abstract syntax tree (AST) instead of only string manipulation
 * @returns a function that renders a limited subset of Markdown to HTML
 */
export async function getMarkdownRenderer(): Promise<(text: string) => string> {
  const { marked, Renderer } = await import('marked');

  const renderer = new Renderer();

  renderer.heading = ({ tokens, depth }) => {
    const text = marked.Parser.parseInline(tokens);
    const cls = depth === 1 ? 'text-h1' : depth === 2 ? 'text-h2' : 'text-ui-large';

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
  return (text: string) => DOMPurify.sanitize(marked.parse(escape(text), { renderer }) as string);
}

/**
 * Create a Markdown renderer that preserves completed blocks between updates.
 */
export async function getMarkdownStreamRenderer(): Promise<MarkdownStreamRenderer> {
  const { marked } = await import('marked');
  const renderMarkdown = await getMarkdownRenderer();
  // Rendered nodes that no longer need updates.
  const nodes: MarkdownNodeState[] = [];
  // Last Markdown block that may still change as text arrives.
  let pendingSource = '';
  // Rendered node for the current mutable block.
  let pendingNode: MarkdownNodeState | null = null;
  // Stable key for each finalized node.
  let nextNodeKey = 0;

  // Render a Markdown source segment with a stable key.
  const createNode = (segment: MarkdownSourceSegment, key: number): MarkdownNodeState | null => {
    if (segment.type === 'code') {
      return { ...segment,
        key };
    }

    const html = renderMarkdown(segment.text);

    return html
      ? { type: 'text',
          html,
          key,
          source: segment.source }
      : null;
  };

  // Render a source prefix into newly finalized nodes.
  const createNodes = (text: string, reusableNode: MarkdownNodeState | null): MarkdownNodeState[] => {
    return splitMarkdownSourceSegments(text).flatMap((segment): MarkdownNodeState[] => {
      const canReuseNode = reusableNode
        && reusableNode.type === segment.type
        && (reusableNode.source.startsWith(segment.source) || segment.source.startsWith(reusableNode.source));
      const node = createNode(segment, canReuseNode ? reusableNode.key : nextNodeKey);

      if (!node) {
        return [];
      }

      if (!canReuseNode) {
        nextNodeKey++;
      }

      return [node];
    });
  };

  // Find the source prefix that cannot be extended by later text.
  const getCompletedSourceLength = (text: string): number => {
    const tokens = marked.lexer(text);
    let lastContentTokenIndex = -1;

    for (let index = tokens.length - 1; index >= 0; index--) {
      if (tokens[index].type !== 'space') {
        lastContentTokenIndex = index;

        break;
      }
    }

    if (lastContentTokenIndex === -1) {
      return 0;
    }

    const lastContentToken = tokens[lastContentTokenIndex];
    const isClosedCodeFence = lastContentToken.type === 'code'
      && /^```[\w+-]*\r?\n[\s\S]*?```$/.test(lastContentToken.raw);
    const completedTokens = lastContentTokenIndex < tokens.length - 1 || isClosedCodeFence
      ? tokens
      : tokens.slice(0, lastContentTokenIndex);

    return completedTokens.reduce((length, token) => length + token.raw.length, 0);
  };

  // Return a live code segment after an opening triple-backtick fence.
  const getOpenCodeSegment = (text: string): MarkdownSourceSegment | null => {
    const match = /^```([\w+-]+)?\r?\n([\s\S]*)$/.exec(text);

    return match ? createCodeSegment(match[1], match[2], text) : null;
  };

  // Render the current mutable source as text or a live code block.
  const createPendingNode = (reusableNode: MarkdownNodeState | null): MarkdownNodeState | null => {
    if (!pendingSource) {
      return null;
    }

    const segment = getOpenCodeSegment(pendingSource) ?? {
      type: 'text' as const,
      text: pendingSource,
      source: pendingSource,
    };
    const canReuseNode = reusableNode?.type === segment.type;
    const node = createNode(segment, canReuseNode ? reusableNode.key : nextNodeKey);

    if (node && !canReuseNode) {
      nextNodeKey++;
    }

    return node;
  };

  // Combine finalized nodes with the current mutable tail.
  const getCurrentNodes = (): MarkdownNode[] => {
    return pendingNode ? [...nodes, pendingNode] : [...nodes];
  };

  return {
    append(delta: string): MarkdownNode[] {
      pendingSource += delta;

      const completedSourceLength = getCompletedSourceLength(pendingSource);

      if (completedSourceLength) {
        nodes.push(...createNodes(pendingSource.slice(0, completedSourceLength), pendingNode));
        pendingSource = pendingSource.slice(completedSourceLength);
        pendingNode = null;
      }

      pendingNode = createPendingNode(pendingNode);

      return getCurrentNodes();
    },
    finish(): MarkdownNode[] {
      if (pendingNode) {
        nodes.push(pendingNode);
        pendingNode = null;
      }

      return getCurrentNodes();
    },
  };
}
