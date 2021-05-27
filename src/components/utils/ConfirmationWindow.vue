<template>
  <PopupDialog>
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
        />
        <UiButton
          secondary
          content="Cancel"
        />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import Vue from 'vue';
import PopupDialog from '@/components/utils/PopupDialog.vue';
import UiButton from '@/components/utils/UiButton.vue';

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
     * Description of confirmating action
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
  }
});
</script>

<style>
.confirmation-window {
  &__wrapper {
    max-width: 340px;
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

    margin-bottom: 20px;
  }

  &__continue-button {
    margin-right: 20px;
  }
}
</style>
