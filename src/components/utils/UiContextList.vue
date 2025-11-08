<template>
  <div class="ui-context-list">
    <div
      v-for="item in items"
      :key="item.label"
      class="ui-context-list__item"
      :class="{
        'ui-context-list__item--active': item.isActive,
      }"
      @click="item.onActivate"
    >
      <Icon
        v-if="item.icon"
        :symbol="item.icon"
      />
      {{ item.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from './Icon.vue';

/**
 * Structure of item for UiContextList component
 */
export interface UiContextListItem {
  /**
   * Label to display in the item
   */
  label: string;

  /**
   * Whether the item is active
   */
  isActive: boolean;

  /**
   * Function to call when the item is activated
   */
  onActivate: () => void;

  /**
   * Optional Icon to display in the item
   */
  icon?: string;
}

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    /**
     * Items to display in the context list
     */
    items: {
      type: Array as () => UiContextListItem[],
      default: () => [],
    },
  },
});
</script>

<style scoped>
.ui-context-list {
  --icon-size: 12px;
  --items-gap: 1px;
  --inner-gap: 6px;
  --popover-gap: 4px;
  --radius: 7px;
  --item-radius: 5px;
  --font-size: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--items-gap);
  padding: 2px;
  background-color: var(--color-bg-second);
  border-radius: var(--radius);

  &__item {
    display: flex;
    gap: var(--inner-gap);
    align-items: center;
    padding: 6px 7px;
    color: var(--color-text-main);
    font-weight: 500;
    font-size: var(--font-size);
    line-height: var(--icon-size);
    white-space: nowrap;
    border-radius: var(--item-radius);
    cursor: pointer;

    &:hover {
      background-color: var(--color-bg-main);
    }

    &--active {
      font-weight: 600;
      pointer-events: none;
    }

    .icon {
      width: var(--icon-size);
      height: var(--icon-size);
    }
  }
}
</style>
