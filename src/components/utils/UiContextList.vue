<template>
  <div class="ui-context-list">
    <div
      v-for="item in items"
      :key="item.label"
      class="ui-context-list__item"
      :class="{
        'ui-context-list__item--active': item.isActive,
        'ui-context-list__item--disabled': item.isDisabled,
      }"
      @click="onClick(item)"
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
import Vue from 'vue';
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

  /**
   * Whether the item is disabled
   */
  isDisabled?: boolean;
}

export default Vue.extend({
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
  methods: {
    onClick(item: UiContextListItem): void {
      if (item.isDisabled) {
        return;
      }
      item.onActivate();
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

  display: flex;
  flex-direction: column;
  gap: var(--items-gap);
  position: relative;
  padding: 2px;
  border-radius: var(--radius);
  background-color: var(--color-bg-second);

  &__item {
    display: flex;
    align-items: center;
    gap: var(--inner-gap);
    padding: 6px 7px;
    border-radius: var(--item-radius);
    font-size: var(--font-size);
    line-height: var(--icon-size);
    font-weight: 500;
    color: var(--color-text-main);
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: var(--color-bg-main);
    }

    &--active {
      font-weight: 800;
      pointer-events: none;
      color: var(--color-text-highlighted);
    }

    &--disabled {
      cursor: default;
      opacity: 0.4;
    }

    .icon {
      width: var(--icon-size);
      height: var(--icon-size);
    }
  }
}
</style>
