<template>
  <div class="markdown-view">
    <MarkdownBlock
      v-for="(block, index) in blocks"
      :key="index"
      v-memo="[block]"
      :block="block"
    />
  </div>
</template>

<script lang="ts">
import MarkdownBlock from './Block.vue';
import { defineComponent, type PropType } from 'vue';
import { type Token as BlockToken } from 'marked';

export default defineComponent({
  name: 'MarkdownView',
  components: {
    MarkdownBlock,
  },
  props: {
    /**
     * Blocks to render. A block renders again only when it is replaced by another object.
     */
    blocks: {
      type: Array as PropType<BlockToken[]>,
      default: () => [],
    },
  },
});
</script>

<style>
.markdown-view {
  color: var(--base--text);
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  overflow-wrap: break-word;

  > :first-child {
    margin-block-start: 0;
  }

  & > &__code + * {
    margin-block-start: 0;
  }

  > :last-child {
    margin-block-end: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: var(--spacing-l) 0 var(--spacing-ml);
    color: var(--base--text);
    font-weight: 600;
    line-height: 1.25;
  }

  h1, h2 {
    padding-block-end: var(--spacing-s);
    border-block-end: var(--delimiter-height) solid var(--base--border);
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  h3 {
    font-size: 1.2rem;
  }

  h4, h5, h6 {
    font-size: 1rem;
  }

  h6 {
    color: var(--base--text-secondary);
  }

  p, blockquote, ul, ol, table, hr, &__code {
    margin-block: 0 var(--spacing-ml);
  }

  a {
    color: var(--accent--solid);
    text-decoration: underline;
    text-underline-offset: 0.2rem;

    &:hover {
      color: var(--accent--solid-hover);
    }
  }

  strong {
    font-weight: 600;
  }

  img {
    max-width: 100%;
  }

  mark {
    color: var(--base--text);
    background-color: var(--accent--bg-secondary);
  }

  blockquote {
    padding: 0 0 0 var(--spacing-l);
    color: var(--base--text-secondary);
    border-inline-start: 3px solid var(--accent--solid);

    > :first-child {
      margin-block-start: 0;
    }

    > :last-child {
      margin-block-end: 0;
    }
  }

  ul, ol {
    padding-inline-start: var(--spacing-xl);
  }

  li {
    list-style-position: outside;
  }

  ul ul, ul ol, ol ul, ol ol {
    margin-block: var(--spacing-xxs) 0;
  }

  ul > li {
    list-style-type: disc;
  }

  ol > li {
    list-style-type: decimal;
  }

  ol ol > li, ul ol > li {
    list-style-type: lower-roman;
  }

  ul ul ol > li, ul ol ol > li, ol ul ol > li, ol ol ol > li {
    list-style-type: lower-alpha;
  }

  li + li {
    margin-block-start: var(--spacing-xxs);
  }

  li > p {
    margin-block: var(--spacing-s) 0;
  }

  li > p:first-child {
    margin-block-start: 0;
  }

  /* The item's own text brings no margin to space these off. */
  & li > :is(blockquote, table, hr, &__code) {
    margin-block-start: var(--spacing-ml);
  }

  table {
    display: block;
    width: max-content;
    max-width: 100%;
    overflow: auto;
    word-break: normal;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }

  tr {
    background-color: var(--base--bg-primary);

    &:nth-child(2n) {
      background-color: var(--base--bg-secondary);
    }
  }

  th, td {
    padding: var(--spacing-xs) var(--spacing-m);
    text-align: start;
    vertical-align: top;
    border: var(--delimiter-height) solid var(--base--border);
  }

  th {
    font-weight: 600;
  }

  hr {
    height: var(--spacing-xxs);
    background-color: var(--base--border);
    border: 0;
  }

  code {
    margin: 0;
    padding: 0.15em 0.4em;
    color: var(--base--text);
    font-size: 85%;
    font-family: var(--font-monospace);
    white-space: break-spaces;
    background-color: var(--base--bg-secondary);
    border: var(--delimiter-height) solid var(--base--border);
    border-radius: var(--radius-s);
  }
}
</style>
