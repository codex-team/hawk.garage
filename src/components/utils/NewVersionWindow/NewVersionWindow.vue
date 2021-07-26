<template>
  <transition
    v-if="isOpened"
    name="new-version-dialog-animation"
    appear
    @close="close()"
  >
    <div class="new-version-dialog__wrapper">
      <div class="new-version-window__wrapper">
        <div class="new-version-window__title">
          {{ description }}
          <UiButton
            :submit="true"
            content="Refresh"
            class="new-version-window__continue-button"
            @click="
              () => {
                onConfirm();
                close();
              }
            "
          />
          <UiButton
            secondary
            :content="$t('components.confirmationWindow.cancel')"
            @click="close()"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
import UiButton from '../UiButton.vue';

/**
 * @link './README.md'
 */
export default Vue.extend({
  name: 'NewVersionWindow',
  components: {
    UiButton
  },
  data() {
    return {
      /**
       * Is confirmation window open
       */
      isOpened: false,

      /**
       * Description of confirming action
       */
      description: 'The new version is available',

      /**
       * onConfirm callback when user clicks continue button
       */
      onConfirm: () => {
        window.location.reload();
      },

    }
  },
  methods: {
    /**
     * Show confirmation window
     *
     * @param options - options for displaying
     */
    open() {
      this.isOpened = true;
    },

    /**
     * Hide confirmation window
     */
    close() {
      this.isOpened = false;
    }
  }
});
</script>

<style>
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }

  50% {
    opacity: 1;
    transform: scale(1.05);
  }

  70% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
}
.new-version-dialog {
  &-animation {
    &-enter-active {
      animation: bounceIn 600ms ease;
    }
  }

  &__wrapper {
    @apply --hide-scrollbar;
    position: fixed;
    right: 30px;
    bottom: 30px;
    z-index: 9995;
    border-radius: 12px;
    background-color: var(--color-bg-second);
    box-shadow: 0 6px 17px -4px rgb(0 0 0 / 61%);
  }
}
.new-version-window {
  &__wrapper {
    width: 483px;
    padding: 8px 15px;
  }

  &__title {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
