<template>
  <button
    class="ui-button"
    :class="{
      'ui-button--submit': submit,
      'ui-button--small': small,
      'ui-button--loading': isLoading,
    }"
    @click="$emit('click')"
  >
    <Icon
      v-if="icon"
      class="ui-button-icon"
      :class="'ui-button-icon-' + icon"
      :symbol="icon"
    />
    <span class="ui-button-text">
      {{ content }}
    </span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from './Icon.vue';

export default Vue.extend({
  name: 'UiButton',
  components: {
    Icon,
  },
  props: {
    /**
     * Button content
     */
    content: {
      type: String,
      default: '',
    },

    /**
     * Will icon show or not
     */
    icon: {
      type: String,
      default: '',
    },

    /**
     * Pass true to make button blue
     */
    submit: {
      type: Boolean,
      default: false,
    },

    /**
     * Pass true to make button small size
     */
    small: {
      type: Boolean,
      default: false,
    },

    /**
     * Indicates loading state
     */
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style>
.ui-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 15px;
  color: var(--color-text-second);
  border: solid 1px color-mod(var(--color-text-main) alpha(10%));
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  background: transparent;
  outline: none;

  &--small {
    padding: 6px 7px;
  }

  &--submit {
    color: var(--color-text-main);
    background: var(--color-indicator-medium);
    border: 0;

    &:hover {
      background: var(--color-indicator-medium-dark);
    }
  }

  $loaderColor: color-mod(var(--color-bg-sidebar) alpha(30%));
  $sumitLoaderColor: color-mod(var(--color-indicator-medium) blend(black 12%));
  $loaderSize: 56px;

  &--loading,
  &--submit&--loading {
    background-size: $loaderSize $loaderSize;
    animation: loading-bar 1200ms infinite linear;
  }

  &--loading {
    background-image: repeating-linear-gradient(-45deg, transparent, transparent 4px, $loaderColor 4px, $loaderColor 8px);
  }

  &--submit&--loading {
    background-image: repeating-linear-gradient(-45deg, transparent, transparent 4px, $sumitLoaderColor 4px, $sumitLoaderColor 8px);
  }

  &:hover {
    color: var(--color-text-main);
  }

  &-icon {
    width: 15px;
    height: 14px;
    margin-right: 5px;
  }

  &-text {
    font-weight: 500;
    font-size: 14px;
  }
}

@keyframes loading-bar {
  100% {
    background-position: -$loaderSize 0;
  }
}

</style>
