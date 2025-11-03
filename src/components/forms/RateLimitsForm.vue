<template>
  <form class="rate-limits-form" @submit.prevent="handleSubmit">
    <div class="rate-limits-form__fields">
      <TextFieldset
        :value="currentThreshold"
        type="number"
        :required="true"
        :disabled="disabled"
        :is-invalid="isThresholdInvalid"
        :maxlength="10"
        :label="$t('projects.settings.rateLimits.threshold')"
        @input="onThresholdInput"
        @keypress="onKeyPress"
      />
      <TextFieldset
        :value="currentPeriod"
        type="number"
        :required="true"
        :disabled="disabled"
        :is-invalid="isPeriodInvalid"
        :maxlength="10"
        :label="$t('projects.settings.rateLimits.period')"
        @input="onPeriodInput"
        @keypress="onKeyPress"
      />
    </div>

    <div class="rate-limits-form__submit-area">
      <div v-if="showPeriodError" class="rate-limits-form__error-message">
        {{ $t('projects.settings.rateLimits.periodDescription') }}
      </div>
      <button
        class="button button--submit rate-limits-form__submit-button"
        type="submit"
        :disabled="disabled || !isFormValid || !hasChanges"
      >
        {{ $t('projects.settings.rateLimits.submit') }}
      </button>
      <button
        class="button ui-button--warning rate-limits-form__clear-button"
        type="button"
        :disabled="!value || disabled"
        @click="handleClear"
      >
        {{ $t('projects.settings.rateLimits.clear') }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import TextFieldset from './TextFieldset.vue';

/**
 * Rate limits configuration
 */
export interface RateLimitSettings {
  /**
   * Rate limit threshold (N events)
   */
  N: number;

  /**
   * Rate limit period in seconds (T seconds)
   */
  T: number;
}

export default Vue.extend({
  name: 'RateLimitsForm',
  components: {
    TextFieldset,
  },
  props: {
    /**
     * Current rate limit settings
     */
    value: {
      type: Object as () => RateLimitSettings | null | undefined,
      default: null,
    },

    /**
     * Whether the form is disabled
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedThreshold: '',
      periodSeconds: '',
    };
  },
  computed: {
    /**
     * Current threshold value from prop or local state
     */
    currentThreshold(): string {
      return this.selectedThreshold || this.value?.N?.toString() || '';
    },

    /**
     * Current period value from prop or local state
     */
    currentPeriod(): string {
      return this.periodSeconds || this.value?.T?.toString() || '';
    },

    /**
     * Check if threshold value should be marked as invalid (only if value is entered)
     */
    isThresholdInvalid(): boolean {
      const str = this.currentThreshold.toString().trim();
      if (!str) {
        return false;
      }
      const num = Number.parseInt(str, 10);
      return Number.isNaN(num) || num <= 0 || !/^\d+$/.test(str);
    },

    /**
     * Check if period value should be marked as invalid (only if value is entered)
     */
    isPeriodInvalid(): boolean {
      const str = this.currentPeriod.toString().trim();
      if (!str) {
        return false;
      }
      const num = Number.parseInt(str, 10);
      return Number.isNaN(num) || num < 60 || !/^\d+$/.test(str);
    },

    /**
     * Show period error message when user enters invalid value
     */
    showPeriodError(): boolean {
      const str = this.currentPeriod.toString().trim();
      if (!str) {
        return false;
      }
      const num = Number.parseInt(str, 10);
      return !Number.isNaN(num) && num < 60 && /^\d+$/.test(str);
    },

    /**
     * Check if threshold value is valid (positive integer > 0)
     */
    isThresholdValid(): boolean {
      const str = this.currentThreshold.toString().trim();
      if (!str) {
        return false;
      }
      const num = Number.parseInt(str, 10);
      return !Number.isNaN(num) && num > 0 && /^\d+$/.test(str);
    },

    /**
     * Check if period value is valid (positive integer >= 60)
     */
    isPeriodValid(): boolean {
      const str = this.currentPeriod.toString().trim();
      if (!str) {
        return false;
      }
      const num = Number.parseInt(str, 10);
      return !Number.isNaN(num) && num >= 60 && /^\d+$/.test(str);
    },

    /**
     * Check if form is valid and can be submitted
     */
    isFormValid(): boolean {
      return this.isThresholdValid && this.isPeriodValid;
    },

    /**
     * Check if form values have changed from original
     */
    hasChanges(): boolean {
      const thresholdStr = this.currentThreshold.toString().trim();
      const periodStr = this.currentPeriod.toString().trim();

      const currentN = thresholdStr ? Number.parseInt(thresholdStr, 10) : null;
      const currentT = periodStr ? Number.parseInt(periodStr, 10) : null;

      const originalN = this.value?.N ?? null;
      const originalT = this.value?.T ?? null;

      // If both are null/empty, no changes
      if (currentN === null && currentT === null && originalN === null && originalT === null) {
        return false;
      }

      // If original was null but we have values, there are changes
      if (originalN === null && originalT === null && (currentN !== null || currentT !== null)) {
        return true;
      }

      // Compare values
      return currentN !== originalN || currentT !== originalT;
    },
  },
  watch: {
    value() {
      if (this.value) {
        this.selectedThreshold = this.value.N?.toString() || '';
        this.periodSeconds = this.value.T?.toString() || '';
      } else {
        this.selectedThreshold = '';
        this.periodSeconds = '';
      }
    },
  },
  methods: {
    /**
     * Handle threshold input changes
     */
    onThresholdInput(value: string) {
      let numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 10) {
        numericValue = numericValue.slice(0, 10);
      }
      this.selectedThreshold = numericValue;
    },

    /**
     * Handle period input changes
     */
    onPeriodInput(value: string) {
      let numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 10) {
        numericValue = numericValue.slice(0, 10);
      }
      this.periodSeconds = numericValue;
    },

    /**
     * Prevent non-numeric input
     */
    onKeyPress(event: KeyboardEvent) {
      const allowedKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Tab',
        'Home',
        'End',
      ];
      const isDigit = /^\d$/.test(event.key);
      const isAllowedKey = allowedKeys.includes(event.key);
      const isModifier = event.ctrlKey || event.metaKey || event.altKey;

      if (!isDigit && !isAllowedKey && !isModifier) {
        event.preventDefault();
      }
    },

    /**
     * Handle form submit
     */
    handleSubmit() {
      if (this.disabled || !this.isFormValid) {
        return;
      }

      const rateLimitSettings: RateLimitSettings = {
        N: Number.parseInt(this.currentThreshold, 10),
        T: Number.parseInt(this.currentPeriod, 10),
      };

      this.$emit('submit', rateLimitSettings);
    },

    /**
     * Handle clear button click
     */
    handleClear() {
      if (this.disabled) {
        return;
      }

      this.$emit('clear');
    },
  },
});
</script>

<style>
@import url('../../styles/custom-properties.css');

.rate-limits-form {
  display: flex;
  flex-wrap: wrap;

  &__fields {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .form-fieldset__label {
      font-weight: 400;
      font-size: 13px;
      text-transform: none;
    }

    .form-fieldset__input:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__submit-area {
    flex-basis: 100%;
  }

  &__submit-button {
    margin: 0 10px 20px 0;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__clear-button {
    margin: 0 0 20px 0;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__error-message {
    color: var(--color-indicator-critical);
    font-size: 13px;
    margin-top: -15px;
    margin-bottom: 20px;
  }
}
</style>
