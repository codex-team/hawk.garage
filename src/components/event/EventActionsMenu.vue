<template>
  <div class="event-actions-menu">
    <button
      v-for="(item, index) in items"
      :key="index"
      class="event-actions-menu__item"
      :class="{ 'event-actions-menu__item--danger': item.danger }"
      @click="item.onClick"
    >
      <Icon
        v-if="item.icon"
        :name="item.icon"
        class="event-actions-menu__icon"
      />
      {{ item.title }}
    </button>
  </div>
</template>

<script lang="ts">
import { Icon } from '@codexteam/ui/vue';
import { defineComponent, PropType } from 'vue';

export interface EventActionItem {
  /** Button label */
  title: string;

  /** Icon name from @codexteam/icons, e.g. 'Trash', 'Cross' */
  icon?: string;

  /** When true, renders the item in danger/red colour */
  danger?: boolean;

  /** Click handler */
  onClick: () => void;
}

export default defineComponent({
  name: 'EventActionsMenu',
  components: { Icon },
  props: {
    /**
     * List of action items to show in the menu
     */
    items: {
      type: Array as PropType<EventActionItem[]>,
      required: true,
    },
  },
});
</script>

<style scoped>
.event-actions-menu {
  padding: 4px;
  min-width: 140px;
}

.event-actions-menu__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 8px;
  color: var(--color-text-main);
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
}

.event-actions-menu__item:hover {
  background-color: color-mod(var(--color-text-main) alpha(8%));
}

.event-actions-menu__item--danger {
  color: var(--color-indicator-critical);
}

.event-actions-menu__item--danger:hover {
  background-color: color-mod(var(--color-indicator-critical) alpha(10%));
}

.event-actions-menu__icon {
  flex-shrink: 0;
  width: 16px;
}
</style>
