<template>
  <form class="rate-limits-form" @submit.prevent="handleSubmit">
    <div class="rate-limits-form__fields">
      <TextFieldset
        v-model="selectedThreshold"
        type="number"
        :required="true"
        :disabled="disabled"
        :is-invalid="!isThresholdValid"
        :label="$t('projects.settings.rateLimits.threshold')"
        @input="onInput"
      />
      <TextFieldset
        v-model="periodSeconds"
        type="number"
        :required="true"
        :disabled="disabled"
        :is-invalid="!isPeriodValid"
        :label="$t('projects.settings.rateLimits.period')"
        @input="onInput"
      />
    </div>

    <div class="rate-limits-form__submit-area">
      <button
        v-if="showSubmitButton && !disabled && isFormValid"
        class="button button--submit rate-limits-form__submit-button"
        type="submit"
      >
        {{ $t('projects.settings.rateLimits.submit') }}
      </button>
      <button
        v-if="value && !disabled"
        class="button button--submit rate-limits-form__clear-button"
        type="button"
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
      selectedThreshold: this.value?.N?.toString() || '',
      periodSeconds: this.value?.T?.toString() || '',
      showSubmitButton: false,
    };
  },
  computed: {
    /**
     * Check if threshold value is valid (positive integer > 0)
     */
    isThresholdValid(): boolean {
      const str = this.selectedThreshold.toString().trim();
      if (!str) {
        return false;
      }
      const num = Number.parseInt(str, 10);
      return !Number.isNaN(num) && num > 0 && /^[1-9]\d*$/.test(str);
    },

    /**
     * Check if period value is valid (positive integer > 0)
     */
    isPeriodValid(): boolean {
      const str = this.periodSeconds.toString().trim();
      if (!str) {
        return false;
      }
      const num = Number.parseInt(str, 10);
      return !Number.isNaN(num) && num > 0 && /^[1-9]\d*$/.test(str);
    },

    /**
     * Check if form is valid and can be submitted
     */
    isFormValid(): boolean {
      return this.isThresholdValid && this.isPeriodValid;
    },
  },
  watch: {
    value: {
      handler(newValue: RateLimitSettings | null | undefined) {
        if (newValue) {
          this.selectedThreshold = newValue.N?.toString() || '3000';
          this.periodSeconds = newValue.T?.toString() || '60';
        } else {
          // If value is null/undefined, reset to empty/default values
          this.selectedThreshold = '';
          this.periodSeconds = '';
        }
        this.showSubmitButton = false;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    /**
     * Handle input changes
     */
    onInput() {
      this.showSubmitButton = true;
    },

    /**
     * Handle form submit
     */
    handleSubmit() {
      if (this.disabled || !this.isFormValid) {
        return;
      }

      const rateLimitSettings: RateLimitSettings = {
        N: Number.parseInt(this.selectedThreshold, 10),
        T: Number.parseInt(this.periodSeconds, 10),
      };

      this.$emit('submit', rateLimitSettings);
      this.showSubmitButton = false;
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
  }

  &__clear-button {
    margin: 0 0 20px 0;
  }
}
</style>
