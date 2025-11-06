<template>
  <div class="ui-select">
    <div
      class="ui-select__button"
      @click="isOpen = !isOpen"
    >
      <Icon
        v-if="iconLeft"
        :symbol="iconLeft"
      />
      <template v-if="selectedOption">
        {{ selectedOption.label }}
      </template>
      <template v-else>
        {{ placeholder }}
      </template>
      <Icon
        :symbol="iconRight"
      />
    </div>

    <UIContextList
      v-show="isOpen"
      :items="selectOptionsToContextListItems"
      />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from './Icon.vue';
import UIContextList, { UiContextListItem } from './UiContextList.vue';

/**
 * Structure of option for UiSelect component
 */
export interface UiSelectOption {
  /**
   * Label to display in the select
   */
  label: string;

  /**
   * Value to bind with v-model
   */
  value: string;

  /**
   * Optional Icon to display in the select
   */
  icon?: string;
}
/**
 * @todo support closing by click outside @see https://vueuse.org/core/onClickOutside/
 */

export default Vue.extend({
  components: {
    Icon,
    UIContextList,
  },
  props: {
    iconLeft: {
      type: String,
      default: null,
    },
    iconRight: {
      type: String,
      default: 'chevron-down',
    },
    options: {
      type: Array as () => UiSelectOption[],
      default: () => [],
    },
    placeholder: {
      type: String,
      default: 'Select',
    },
    value: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isOpen: false,
      internalValue: this.value,
    };
  },
  computed: {
    selectedOption(): UiSelectOption | undefined {
      return this.options.find(option => option.value === this.internalValue);
    },
    selectOptionsToContextListItems(): UiContextListItem[] {
      return this.options.map(option => ({
        icon: option.icon,
        label: option.label,
        isActive: option.value === this.internalValue,
        onActivate: () => this.onOptionActivate(option),
      }));
    },
  },
  mounted() {
    this.internalValue = this.value;
  },
  methods: {
    close() {
      this.isOpen = false;
    },
    onOptionActivate(option: UiSelectOption) {
      this.internalValue = option.value;
      this.$emit('input', option.value);
      this.close();
    },
  },
});
</script>

<style scoped>
.ui-select {
  --icon-size: 12px;
  --inner-gap: 6px;
  --popover-gap: 4px;
  --radius: 7px;
  --font-size: 12px;

  position: relative;

  &__button {
    display: flex;
    align-items: center;
    gap: var(--inner-gap);
    padding: 6px 9px;
    border-radius: var(--radius);
    background-color: var(--color-bg-second);
    font-size: var(--font-size);
    line-height: var(--icon-size);
    font-weight: 500;
    color: var(--color-text-main);
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: color-mod(var(--color-bg-second) blend(white 2%));
    }

    .icon {
      width: var(--icon-size);
      height: var(--icon-size);
    }
  }


  .ui-context-list {
    position: absolute;
    top: calc(100% + var(--popover-gap));
    right: 0;
    left: 0;
    width: 100%;
  }
}
</style>
