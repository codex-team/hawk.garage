<template>
  <div class="tooltip-menu">
    <div class="tooltip-menu__dots" />
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

/**
 * Options for TooltipMenu component
 */
export interface TooltipMenuOptions {
  /**
   * Item title
   */
  title: string;

  /**
   * Action to perform on item click
   */
  onClick: Function
}

export default Vue.extend({
  name: 'TooltipMenu',
  props: {
    options: {
      type: Array as () => TooltipMenuOptions[],
      required: true,
    },
  },
});
</script>

<style>
  .tooltip-menu {
    position: relative;
    margin-right: -8px;
    padding: 6px 15px 6px 3px;
    cursor: pointer;

    &__popup {
      position: absolute;
      top: 6px;
      color: var(--color-bg-main);
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      white-space: nowrap;
      background-color: var(--color-text-main);
      border: 2px solid var(--color-text-main);
      border-radius: 10px;
      box-shadow: 0 11px 13px -4px rgba(0, 0, 0, 0.5);
      transform: translate3d(22px, -50%, 0);
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

    &__dots {
      position: relative;
      width: 3px;
      height: 3px;
      background-color: var(--color-text-second);

      &::before, &::after {
        position: absolute;
        width: 3px;
        height: 3px;
        background-color: var(--color-text-second);
        content: '';
      }

      &::before {
        top: -6px;
      }

      &::after {
        top: 6px;
      }
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
        background-color: rgba(0, 0, 0, 0.06);

        &::before, & + ^ &__option::before {
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
