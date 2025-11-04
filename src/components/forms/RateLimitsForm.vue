<template>
  <form class="rate-limits-form" @submit.prevent="handleSubmit">
    <div class="rate-limits-form__fields">
      <TextFieldset
        v-model="currentThreshold"
        type="number"
        :required="true"
        :disabled="disabled"
        :is-invalid="!isThresholdValid"
        :min="1"
        :max="1000000000"
        :label="$t('projects.settings.rateLimits.threshold')"
      />
      <TextFieldset
        v-model="currentPeriod"
        type="number"
        :required="true"
        :disabled="disabled"
        :is-invalid="!isPeriodValid"
        :min="60"
        :max="31536000"
        :label="$t('projects.settings.rateLimits.period')"
      />
    </div>

    <div class="rate-limits-form__submit-area">
      <button
        class="button button--submit rate-limits-form__submit-button"
        type="submit"
        :disabled="disabled || !isFormValid || !hasChanges"
      >
        {{ $t('projects.settings.rateLimits.submit') }}
      </button>
      <button
        class="button button--submit rate-limits-form__clear-button"
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
      currentThreshold: '',
      currentPeriod: '',
    };
  },
  computed: {
    /**
     * Check if threshold value is valid (positive integer > 0)
     */
    isThresholdValid(): boolean {
      const str = this.currentThreshold.toString().trim();
      const num = Number.parseInt(str, 10);
      return !Number.isNaN(num) && num >= 1 && num <= 1000000000 && /^\d+$/.test(str);
    },

    /**
     * Check if period value is valid (positive integer >= 60)
     */
    isPeriodValid(): boolean {
      const str = this.currentPeriod.toString().trim();
      const num = Number.parseInt(str, 10);
      return !Number.isNaN(num) && num >= 60 && num <= 31536000 && /^\d+$/.test(str);
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

      return currentN !== originalN || currentT !== originalT;
    },
  },
  watch: {
    value: {
      handler() {
        // Default: 10,000 events per day (86400 seconds in a day)
        this.currentThreshold = this.value?.N?.toString() || '10000';
        this.currentPeriod = this.value?.T?.toString() || '86400';
      },
      immediate: true,
    },
  },
  methods: {
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
    background-color: var(--color-indicator-critical);

    &:hover {
      background-color: var(--color-indicator-critical-dark);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__error-message {
    color: var(--color-indicator-critical);
    font-size: 13px;
    margin-bottom: 20px;
  }
}
</style>
