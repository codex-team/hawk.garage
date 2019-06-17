<template>
  <div class="badge">
    {{content}}
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
  }
};
</script>

<style>
  .badge {
    box-sizing: border-box;
    max-width: 42px;
    color: var(--color-text-main);
    background-color: var(--color-indicator-medium);
    border-radius: 7px;
    padding: 4px 7px 3px 7px;
    font-size: 11px;
    height: 20px;
    line-height: 13px;
    font-weight: bold;
    margin: auto 0 auto auto;
  }
</style>
