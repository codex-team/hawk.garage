<template>
  <span class="project__badge">
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProjectBadge',
});
</script>

<style>
.project__badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 5px;
  overflow-x: hidden;
  color: var(--color-text-second);
  font-weight: normal;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.1px;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid var(--color-border);
  border-radius: 5px;
}
</style>
