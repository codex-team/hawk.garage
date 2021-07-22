<template>
  <transition
    name="notify-dialog-animation"
    v-if="isOpened"
    @close="close()"
    appear
  >
    <div class="notify-dialog__wrapper">
      <div class="notify-window__wrapper">
        <div class="notify-window__title">
          {{ title }}
          <UiButton
            :submit="actionType === submitAction"
            :warning="actionType === deletionAction"
            :content="continueButtonText"
            class="notify-window__continue-button"
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
import { NotifierActionType, NotifierWindowOptions } from './types';

/**
 * @link './README.md'
 */
export default Vue.extend({
  name: 'NotifierWindow',
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
       * Confirmation window title
       */
      title: 'Confirm action',

      /**
       * Description of confirming action
       */
      description: '',

      /**
       * Text in continue button
       */
      continueButtonText: 'Continue',

      /**
       * onConfirm callback when user clicks continue button
       */
      onConfirm: () => {},

      /**
       * Type of confirmation action
       */
      actionType: NotifierActionType.SUBMIT,

      /**
       * Action type submit const
       */
      submitAction: NotifierActionType.SUBMIT,

      /**
       * Action type deletion const
       */
      deletionAction: NotifierActionType.DELETION,
    }
  },
  methods: {
    /**
     * Show confirmation window
     *
     * @param options - options for displaying
     */
    open(options?: NotifierWindowOptions) {
      this.title = options && options.title || this.$i18n.t('components.confirmationWindow.title').toString();
      this.description = options && options.description || '';
      this.continueButtonText = options && options.continueButtonText || this.$i18n.t('components.confirmationWindow.continue').toString();
      this.onConfirm = options && options.onConfirm || (() => {});
      this.actionType = options && options.actionType || NotifierActionType.SUBMIT;
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
.notify-dialog {
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
.notify-window {
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
