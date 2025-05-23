<template>
  <comment
    :is="href ? 'a' : 'button'"
    class="ui-button"
    :class="{
      'ui-button--submit': submit,
      'ui-button--warning': warning,
      'ui-button--small': small,
      'ui-button--loading': isLoading,
      'ui-button--shaking': shaking,
      'ui-button--rounded': rounded,
      'ui-button--disabled': disabled,
      'ui-button--secondary': secondary,
      'ui-button--icon-only': icon && !content,
      'ui-button--iconic': iconic,
    }"
    :disabled="disabled"
    :href="href || null"
    @click="$emit('click', $event)"
    data-ripple
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
  </comment>
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
     * Pass true to make button grey
     */
    secondary: {
      type: Boolean,
      default: false,
    },

    /**
     * Pass true to make button red
     */
    warning: {
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
     * Transparent only-icon button with circle hover effect
     */
    iconic: {
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

    /**
     * If passed, button will be presented as <a> tag
     */
    href: {
      type: String,
      default: '',
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
  color: var(--color-text-second);
  text-decoration: none !important;
  background-color: transparent;
  border: solid 1px color-mod(var(--color-text-main) alpha(10%));
  border-radius: 4px;
  outline: none;
  user-select: none;

  &:not(&--disabled) {
    cursor: pointer;
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
    color: var(--color-text-main) !important;
    background-color: var(--color-indicator-medium);
    border: 0;

    &:not(^&--disabled):hover {
      background-color: var(--color-indicator-medium-dark);
    }
  }

  &--secondary {
    color: var(--color-text-main);
    background-color: var(--color-indicator-low);
    border: 0;
  }

  &--warning {
    color: var(--color-text-main);
    background-color: var(--color-indicator-critical);
    border: 0;

    &:not(^&--disabled):hover {
      background-color: var(--color-indicator-critical-dark);
    }
  }

  &--rounded {
    padding: 5px 15px;
    /* Will set border radius as half of height */
    border-radius: 1000px;
  }

  &--iconic {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    border: 0;

    &:not(&--disabled):hover {
      background-color: var(--color-bg-second);
    }
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

  &--icon-only &-icon {
    margin-right: 0;
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
