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
          :submit="submit"
          :warning="deletion"
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
import ConfirmationWindowOptions from './ConfirmationWindowsOptions';

export default Vue.extend({
  name: 'ConfirmationWindow',
  components: {
    PopupDialog,
    UiButton
  },
  props: {
    /**
     * Confirmation window title
     */
    title: {
      type: String,
      default: 'Confirm action'
    },

    /**
     * Description of confirming action
     */
    description: {
      type: String,
      default: ''
    },

    /**
     * Text in continue button
     */
    continueButtonText: {
      type: String,
      default: 'Continue'
    },

    /**
     * onConfirm callback when user clicks continue button
     */
    onConfirm: {
      type: Function,
      default: () => {}
    },

    /**
     * Is window submit action
     */
    submit: {
      type: Boolean,
      default: true
    },

    /**
     * Is window delete action
     */
    deletion: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isOpened: false
    }
  },
  methods: {
    /**
     * Show confirmation window
     *
     * @param options - options for displaying
     */
    open(options?: ConfirmationWindowOptions) {
      if (options && options.title) this.title = options.title;
      if (options && options.description) this.description = options.description;
      if (options && options.continueButtonText) this.continueButtonText = options.continueButtonText;
      if (options && options.onConfirm) this.onConfirm = options.onConfirm;
      if (options && options.submit) this.submit = options.submit;
      if (options && options.deletion) this.deletion = options.deletion;
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
