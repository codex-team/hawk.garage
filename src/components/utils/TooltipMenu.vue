<template>
  <div class="tooltip-menu">
    <Icon
      symbol="dots-vertical"
      width="3"
      height="15"
    />
    <div class="tooltip-menu__popup">
      <div
        v-for="option in options"
        :key="option.title"
        class="tooltip-menu__option"
        @click="option.onClick"
      >
        {{ option.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from './Icon.vue';

/**
 * Represents single item of a menu
 */
export interface TooltipMenuItem {
  /**
   * Text on menu item
   */
  title: string;

  /**
   * Click callback function
   */
  onClick: () => void;
}

export default Vue.extend({
  name: 'TooltipMenu',
  components: {
    Icon,
  },
  props: {
    /**
     * Menu items
     */
    options: {
      type: Array as () => TooltipMenuItem[],
      required: true,
    },
  },
});
</script>

<style>
  .tooltip-menu {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-right: -8px;
    border-radius: var(--border-radius);
    cursor: pointer;

    .icon {
      color: var(--color-text-second);
    }

    &:hover {
      .icon {
        color: var(--color-text-main)
      }
    }

    &__popup {
      position: absolute;
      top: 50%;
      left: 100%;
      color: var(--color-bg-main);
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      white-space: nowrap;
      background-color: var(--color-text-main);
      border: 2px solid var(--color-text-main);
      border-radius: 10px;
      box-shadow: 0 11px 13px -4px rgba(0, 0, 0, 0.5);
      transform: translate3d(0, -50%, 0);
      opacity: 0;
      transition: opacity .1s ease-in;
      pointer-events: none;

      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        width: 0;
        height: 0;
        border-color: transparent var(--color-text-main) transparent transparent;
        border-style: solid;
        border-width: 9px 9px 9px 0;
        transform: translate3d(-100%, -50%, 0);
        content: '';
      }
    }

    &:hover &__popup {
      opacity: 1;
      pointer-events: auto;
    }

    &__option {
      position: relative;
      padding: 9px 17px;
      background-color: var(--color-text-main);
      border: none;
      cursor: pointer;
      user-select: none;

      &:not(:first-child)::before {
        position: absolute;
        top: 0;
        right: 0;
        width: calc(100% - 17px);
        height: 1px;
        background-color: var(--color-bg-main);
        opacity: 0.14;
        content: '';
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.4);

        &::before, & + ^&__option::before {
          display: none;
        }
      }

      &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      &:last-child {
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
      }
    }
  }
</style>
