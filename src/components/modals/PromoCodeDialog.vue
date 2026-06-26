<template>
  <PopupDialog @close="emit('close')">
    <form
      ref="formRef"
      class="promo-code-dialog"
      @click.stop
      @submit.prevent.stop="onSubmit"
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

      <div
        class="promo-code-dialog__error"
        :class="{
          'promo-code-dialog__error--hidden': !errorMessage,
        }"
        aria-live="polite"
      >
        {{ errorMessage }}
      </div>

      <div class="promo-code-dialog__actions">
        <UiButton
          type="button"
          secondary
          :content="$t('components.confirmationWindow.cancel')"
          :disabled="isLoading"
          @click.prevent="emit('close')"
        />
        <UiButton
          type="submit"
          submit
          :content="$t('billing.promoCode.apply')"
          :disabled="!value.trim() || isLoading"
          :is-loading="isLoading"
        />
      </div>
    </form>
  </PopupDialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import PopupDialog from '../utils/PopupDialog.vue';
import TextFieldset from '../forms/TextFieldset.vue';
import UiButton from '../utils/UiButton.vue';

interface Props {
  /**
   * Loading state.
   */
  isLoading?: boolean;

  /**
   * Invalid input state.
   */
  isInvalid?: boolean;

  /**
   * Error text shown under the input.
   */
  errorMessage?: string;
}

const {
  isLoading = false,
  isInvalid = false,
  errorMessage = '',
} = defineProps<Props>();

const emit = defineEmits<{
  /**
   * Applies entered promo code value.
   */
  (event: 'apply', value: string): void;

  /**
   * Closes the dialog.
   */
  (event: 'close'): void;
}>();

const value = ref('');
const formRef = ref<HTMLFormElement | null>(null);

onMounted(() => {
  nextTick(() => {
    const input = formRef.value?.querySelector('input[name="promoCode"]') as HTMLInputElement | null;

    input?.focus();
  });
});

/**
 * Emits entered promo code value.
 */
function onSubmit(): void {
  emit('apply', value.value);
}
</script>

<style scoped>
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

  &__error {
    margin-top: -10px;
    margin-bottom: 20px;
    min-height: 18px;
    color: var(--color-indicator-critical);
    font-size: 13px;
    line-height: 1.4;

    &--hidden {
      visibility: hidden;
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
}
</style>
