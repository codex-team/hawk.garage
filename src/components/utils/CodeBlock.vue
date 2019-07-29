<template>
  <pre class="code-block"><code><slot /></code></pre>
</template>

<script>
import hljs from 'highlight.js';

export default {
  name: 'CodeBlock',
  mounted() {
    hljs.highlightBlock(this.$el);
  }
};
</script>
<style src="highlight.js/styles/darcula.css"></style>
