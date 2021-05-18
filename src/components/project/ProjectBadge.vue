<template>
  <span class="project__badge">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'ProjectBadge'
};
</script>

<style>
.project__badge {
  display: inline-block;
  border-radius: 5px;
  border: 1px solid var(--color-border);
  color: var(--color-text-second);
  font-weight: normal;
  font-size: 12px;
  line-height: 12px;
  padding: 2px 4px;
  margin-bottom: -2px;
  margin-left: 7px;
  letter-spacing: 0.1px;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
