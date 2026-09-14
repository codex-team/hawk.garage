<script lang="ts">
import DOMPurify from 'dompurify';
import { type Token, type Tokens } from 'marked';
import { defineComponent, h, type PropType, type VNodeChild } from 'vue';
import CodeFragment from '../CodeFragment.vue';

/**
 * Decimal, hexadecimal or named character reference.
 */
const REFERENCE = /&(?:#(\d+)|#x([\da-f]+)|(\w+));/gi;

/**
 * Named references decoded in text.
 */
const ENTITIES = new Map([
  ['amp', '&'],
  ['lt', '<'],
  ['gt', '>'],
  ['quot', '"'],
  ['apos', '\''],
  ['nbsp', '\u00a0'],
]);

/**
 * Largest valid Unicode code point.
 */
const MAX_CODE_POINT = 0x10ffff;

/**
 * Decode character references, since marked keeps them in text as written.
 *
 * @param text - text token content
 * @returns text as the reader should see it
 */
function decodeEntities(text: string): string {
  return text.replace(REFERENCE, (reference, decimal?: string, hex?: string, name?: string) => {
    if (name) {
      return ENTITIES.get(name) ?? reference;
    }

    const code = decimal ? Number.parseInt(decimal, 10) : Number.parseInt(hex ?? '', 16);

    return code > 0 && code <= MAX_CODE_POINT ? String.fromCodePoint(code) : reference;
  });
}

/**
 * Render link token. Also drop unsafe `href`.
 *
 * @param link - link token
 * @returns purified link node
 */
function renderLink(link: Tokens.Link): VNodeChild {
  const href = DOMPurify.isValidAttribute('a', 'href', link.href) ? link.href : undefined;

  return h('a', { href }, renderInline(link.tokens));
}

/**
 * Render inline tokens inside block.
 * Images are skipped: a remote image loads as soon as the dialog opens.
 *
 * @param tokens - inline tokens
 * @returns nodes to place inside block
 */
function renderInline(tokens: Token[] = []): VNodeChild[] {
  return tokens.flatMap((token) => {
    switch (token.type) {
      case 'text':
        return decodeEntities(token.text);
      case 'escape':
      case 'html':
        return token.text;
      case 'codespan':
        return [h('code', token.text)];
      case 'br':
        return h('br');
      case 'link':
        return renderLink(token as Tokens.Link);
      case 'image':
        return [];
      case 'strong':
        return [h('strong', renderInline(token.tokens))];
      case 'em':
        return [h('em', renderInline(token.tokens))];
      case 'del':
        return [h('del', renderInline(token.tokens))];
      default:
        return [h('span', renderInline(token.tokens))];
    }
  });
}

/**
 * Render code block as [CodeFragment].
 *
 * @param code - code block token
 * @returns code fragment block
 */
function renderCodeBlock(code: Tokens.Code): VNodeChild {
  const lines = code.text
    .trimEnd()
    .split('\n')
    .map((content, index) => ({
      line: index + 1,
      content,
    }));

  return h(CodeFragment, {
    class: 'markdown-view__code',
    lines,
    lang: code.lang || 'plaintext',
    copyable: true,
  });
}

/**
 * Render one list item including optional task list parameter.
 *
 * @param item - list item token
 * @returns list item node
 */
function renderListItem(item: Tokens.ListItem): VNodeChild {
  const content = item.tokens.map(renderBlock);

  return h('li', content);
}

/**
 * Render list items.
 *
 * @param list - list token
 * @returns list node
 */
function renderList(list: Tokens.List): VNodeChild {
  const tag = list.ordered ? 'ol' : 'ul';
  const start = list.ordered ? list.start : undefined;
  const items = list.items.map(renderListItem);

  return h(tag, { start }, items);
}

/**
 * Renders one table cell.
 *
 * @param tag - either `th` for table header, or `td` for any data cell
 * @returns a function that renders a cell with specified tag
 */
function renderTableCell(tag: 'th' | 'td'): (cell: Tokens.TableCell) => VNodeChild {
  return (cell) => {
    const style = cell.align ? { textAlign: cell.align } : undefined;

    return h(tag, { style }, renderInline(cell.tokens));
  };
}

/**
 * Renders table.
 *
 * @param table - table token
 * @returns table node
 */
function renderTable(table: Tokens.Table): VNodeChild {
  const head = h('thead', h('tr', table.header.map(renderTableCell('th'))));
  const body = h('tbody', table.rows.map(row => h('tr', row.map(renderTableCell('td')))));

  return h('table', [head, body]);
}

/**
 * Render single markdown token.
 *
 * @param block - markdown block token from lexer
 * @returns node representation of token, or `null` when there is nothing to render
 */
function renderBlock(block: Token): VNodeChild {
  switch (block.type) {
    case 'space':
    case 'def':
      return null;
    case 'hr':
      return h('hr');
    case 'paragraph':
      return h('p', renderInline(block.tokens));
    case 'text':
      return block.tokens ? renderInline(block.tokens) : decodeEntities(block.text);
    case 'html':
      return h('p', (block as Tokens.HTML).text);
    case 'blockquote':
      return h('blockquote', (block as Tokens.Blockquote).tokens.map(renderBlock));
    case 'heading':
      return h(('h' + block.depth), renderInline(block.tokens));
    case 'checkbox':
      return h('input', {
        type: 'checkbox',
        checked: block.checked,
        disabled: true,
      });
    case 'code':
      return renderCodeBlock(block as Tokens.Code);
    case 'list':
      return renderList(block as Tokens.List);
    case 'table':
      return renderTable(block as Tokens.Table);
    default:
      return h('p', block.raw);
  }
}

export default defineComponent({
  name: 'MarkdownBlock',
  props: {
    block: {
      type: Object as PropType<Token>,
      required: true,
    },
  },
  render() {
    return renderBlock(this.block);
  },
});
</script>
