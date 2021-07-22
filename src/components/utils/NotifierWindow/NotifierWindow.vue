<template>
  <NotifierDialog v-if="isOpened" @close="close()">
    <div class="confirmation-window__wrapper">
      <div class="confirmation-window__title">
        {{ title }}
        <UiButton
          :submit="actionType === submitAction"
          :warning="actionType === deletionAction"
          :content="continueButtonText"
          class="confirmation-window__continue-button"
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
  </NotifierDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import NotifierDialog from '../NotifierDialog.vue';
import UiButton from '../UiButton.vue';
import { NotifierActionType, NotifierWindowOptions } from './types';

/**
 * @link './README.md'
 */
export default Vue.extend({
  name: 'NotifierWindow',
  components: {
    NotifierDialog,
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
