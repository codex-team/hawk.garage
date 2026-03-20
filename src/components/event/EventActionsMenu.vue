<template>
  <ContextMenu
    class="event-actions-menu"
    :items="items"
  />
</template>

<script setup lang="ts">
import { ContextMenu, type ContextMenuItem } from '@codexteam/ui/vue';

/**
 * Event actions menu props
 */
interface Props {
  /**
   * List of action items to show in the menu
   */
  items: ContextMenuItem[];
}

defineProps<Props>();
</script>

<style scoped>
.event-actions-menu {
  min-width: 140px;
}
</style>
