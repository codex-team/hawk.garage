<template>
  <PopupDialog @close="$emit('close')">
    <form
      class="promo-code-dialog"
      @submit.prevent="onSubmit"
    >
      <h3 class="promo-code-dialog__title">
        {{ $t('billing.promoCode.title') }}
      </h3>

      <TextFieldset
        v-model="value"
        name="promoCode"
        class="promo-code-dialog__input"
        :label="$t('billing.promoCode.inputLabel')"
        :placeholder="$t('billing.promoCode.inputPlaceholder')"
        :disabled="isLoading"
        :is-invalid="isInvalid"
        auto-complete="off"
      />

      <div class="promo-code-dialog__actions">
        <UiButton
          secondary
          :content="$t('components.confirmationWindow.cancel')"
          :disabled="isLoading"
          @click.prevent="$emit('close')"
        />
        <UiButton
          submit
          :content="$t('billing.promoCode.apply')"
          :disabled="!value.trim() || isLoading"
          :is-loading="isLoading"
        />
      </div>
    </form>
  </PopupDialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import TextFieldset from '../forms/TextFieldset.vue';
import UiButton from '../utils/UiButton.vue';

export default defineComponent({
  name: 'PromoCodeDialog',
  components: {
    PopupDialog,
    TextFieldset,
    UiButton,
  },
  props: {
    /**
     * Loading state.
     */
    isLoading: {
      type: Boolean,
      default: false,
    },

    /**
     * Invalid input state.
     */
    isInvalid: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['apply', 'close'],
  data() {
    return {
      value: '',
    };
  },
  methods: {
    /**
     * Emits entered promo code value.
     */
    onSubmit(): void {
      this.$emit('apply', this.value);
    },
  },
});
</script>

<style>
.promo-code-dialog {
  width: 360px;
  padding: 28px;
  color: var(--color-text-main);
  background: var(--color-bg-second);
  border-radius: 8px;

  &__title {
    margin: 0 0 20px;
    font-size: 18px;
  }

  &__input {
    margin-bottom: 20px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
}
</style>
