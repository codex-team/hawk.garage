<template>
  <div class="badge">
    {{convertedContent}}
  </div>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    /**
     * Badge content
     */
    content: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    convertedContent() {
      if (typeof this.content !== 'number') return this.content;

      const count = this.content.toString();

      if (count.length === 4) return `${count.slice(0, 1)} ${count.slice(1)}`;
      return this.content;
    }
  }
};
</script>

<style>
  .badge {
    box-sizing: border-box;
    color: var(--color-text-main);
    background-color: var(--color-indicator-medium);
    border-radius: 7px;
    padding: 4px 7px 3px 7px;
    font-size: 11px;
    height: 20px;
    line-height: 13px;
    font-weight: bold;
    white-space: nowrap;
  }
</style>
