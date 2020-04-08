<template>
  <CodeBlock
    language="plaintext"
    copyable
    class="project-token-block"
  >
    {{ token }}
  </CodeBlock>
</template>

<script>
import CodeBlock from '../utils/CodeBlock';

export default {
  name: 'ProjectTokenBlock',
  components: {
    CodeBlock,
  },
  props: {
    token: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.project-token-block {
  color: #34ffa8;
  font-size: 12px;
  letter-spacing: 0.15px;
  text-shadow: 0 0 5px rgba(17, 255, 115, 0.29);
  border-radius: 3px;
}
</style>
