<template>
  <button
    class="ui-button"
    :class="{
      'ui-button--submit': submit,
      'ui-button--small': small,
      'ui-button--loading': isLoading,
      'ui-button--shaking': shaking,
      'ui-button--rounded': rounded,
      'ui-button--disabled': disabled,
    }"
    :disabled="disabled"
    @click="$emit('click', $event)"
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

/**
 * Allows to call methods of this component from parent
 *
 * @example (this.$refs.submitButton as unknown as UiButtonComponent).shake();
 */
export interface UiButtonComponent {
  shake: () => void;
}

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

    /**
     * Adds border radius for button
     */
    rounded: {
      type: Boolean,
      default: false,
    },

    /**
     * Disables button
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /**
       * Used to add a class for the shaking animation
       */
      shaking: false,
    };
  },
  methods: {
    /**
     * Shake button to react on some unsuccessful user action
     */
    shake() {
      this.shaking = true;

      setTimeout(() => {
        this.shaking = false;
      }, 300);
    },
  },
});
</script>

<style>
@import '../../styles/custom-properties.css';

.ui-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 15px;
  color: var(--color-text-main);
  background: var(--color-indicator-low);
  border: solid 1px color-mod(var(--color-text-main) alpha(10%));
  border-radius: 4px;
  outline: none;
  user-select: none;

  &:not(&--disabled) {
    cursor: pointer;
    border: 0;
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &--small {
    padding: 6px 7px;
  }

  &--shaking {
    @apply --shaking;
  }

  &--submit {
    background: var(--color-indicator-medium);
    border: 0;

    &:not(^&--disabled):hover {
      background: var(--color-indicator-medium-dark);
    }
  }

  &--rounded {
    padding: 5px 15px;
    /* Will set border radius as half of height */
    border-radius: 1000px;
  }

  $loaderColor: color-mod(var(--color-bg-sidebar) alpha(30%));
  $submitLoaderColor: color-mod(var(--color-indicator-medium) blend(black 12%));
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
    background-image: repeating-linear-gradient(-45deg, transparent, transparent 4px, $submitLoaderColor 4px, $submitLoaderColor 8px);
  }

  &:not(&--disabled):hover {
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
