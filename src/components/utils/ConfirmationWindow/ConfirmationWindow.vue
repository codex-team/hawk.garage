<template>
  <PopupDialog
    v-if="isOpened"
    @close="close()"
  >
    <div class="confirmation-window__wrapper">
      <div class="confirmation-window__title">
        {{ title }}
      </div>
      <div class="confirmation-window__description">
        {{ description }}
      </div>
      <div class="confirmation-window__buttons-wrapper">
        <UiButton
          :submit="actionType === submitAction"
          :warning="actionType === deletionAction"
          :content="continueButtonText"
          class="confirmation-window__continue-button"
          @click="() => {
            onConfirm();
            close();
          }"
        />
        <UiButton
          secondary
          content="Cancel"
          @click="close()"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupDialog from '../PopupDialog.vue';
import UiButton from '../UiButton.vue';
import { ActionType, ConfirmationWindowOptions } from './types';

/**
 * @link './README.md'
 */
export default Vue.extend({
  name: 'ConfirmationWindow',
  components: {
    PopupDialog,
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
      actionType: ActionType.SUBMIT,

      /**
       * Action type submit const
       */
      submitAction: ActionType.SUBMIT,

      /**
       * Action type deletion const
       */
      deletionAction: ActionType.DELETION,
    }
  },
  methods: {
    /**
     * Show confirmation window
     *
     * @param options - options for displaying
     */
    open(options?: ConfirmationWindowOptions) {
      this.title = options && options.title || 'Confirm action';
      this.description = options && options.description || '';
      this.continueButtonText = options && options.continueButtonText || 'Continue';
      this.onConfirm = options && options.onConfirm || (() => {});
      this.actionType = options && options.actionType || ActionType.SUBMIT;
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
.confirmation-window {
  &__wrapper {
    width: 400px;
    padding: 30px;
  }

  &__title {
    font-size: 18px;
    font-weight: bold;

    margin-bottom: 15px;
  }

  &__description {
    color: var(--color-text-second);
    line-height: 1.43;
    font-size: 14px;
    min-height: 1em;
  }

  &__buttons-wrapper {
    margin-top: 20px;
  }

  &__continue-button {
    margin-right: 20px;
  }
}
</style>
