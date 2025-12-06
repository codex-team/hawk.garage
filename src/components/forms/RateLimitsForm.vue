<template>
  <form
    class="rate-limits-form"
    @submit.prevent="handleSubmit"
  >
    <div class="rate-limits-form__fields">
      <NumberInput
        v-model="currentThreshold"
        :placeholder="$t('projects.settings.rateLimits.thresholdPlaceholder')"
        :required="true"
        :disabled="disabled"
        :min="1"
        :max="maxThreshold"
        :label="$t('projects.settings.rateLimits.threshold')"
      />
      <div class="rate-limits-form__period-wrapper">
        <NumberInput
          v-model="currentPeriod"
          :placeholder="$t('projects.settings.rateLimits.periodPlaceholder')"
          :required="true"
          :disabled="disabled"
          :min="60"
          :max="2678400"
          :label="$t('projects.settings.rateLimits.period')"
        />
        <div
          v-if="periodHumanReadable"
          class="rate-limits-form__period-hint"
        >
          {{ periodHumanReadable }}
        </div>
      </div>
    </div>
    <div class="rate-limits-form__submit-area">
      <button
        class="button button--submit rate-limits-form__submit-button"
        type="submit"
        :disabled="disabled || !isFormValid || !hasChanges"
      >
        {{ $t('projects.settings.rateLimits.submit') }}
      </button>
    </div>
    <button
      v-if="value"
      class="button button--submit rate-limits-form__clear-button"
      type="button"
      :disabled="disabled"
      @click="handleClear"
    >
      {{ $t('projects.settings.rateLimits.reset') }}
    </button>
  </form>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import NumberInput from './NumberInput.vue';
import { ProjectRateLimitSettings } from '@/types/project';

export default defineComponent({
  name: 'RateLimitsForm',
  components: {
    NumberInput,
  },
  props: {
    /**
     * Current rate limit settings
     */
    value: {
      type: Object as () => ProjectRateLimitSettings | null | undefined,
      default: null,
    },

    /**
     * Whether the form is disabled
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Maximum threshold value (from plan events limit)
     */
    maxThreshold: {
      type: Number,
      default: 1000000000,
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
     * Check if threshold value is valid (positive integer >= 1)
     */
    isThresholdValid(): boolean {
      return this.isStringNumeric(this.currentThreshold, 1, this.maxThreshold);
    },

    /**
     * Check if period value is valid (positive integer >= 60)
     */
    isPeriodValid(): boolean {
      return this.isStringNumeric(this.currentPeriod, 60, 2678400);
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

    /**
     * Convert seconds to human-readable format (days, hours, minutes)
     */
    periodHumanReadable(): string | null {
      const s = String(this.currentPeriod).trim();
      const seconds = Number.parseInt(s, 10);

      if (Number.isNaN(seconds)) {
        return null;
      }

      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${this.$t('common.timeUnits.d', { days })}
        ${this.$t('common.timeUnits.h', { hours })}
        ${this.$t('common.timeUnits.m', { minutes })}
        ${this.$t('common.timeUnits.s', { seconds: secs })}`.trim();
    },
  },
  watch: {
    value: {
      handler() {
        this.currentThreshold = this.value?.N?.toString() || '';
        this.currentPeriod = this.value?.T?.toString() || '';
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * Check if string is numeric and within min/max range
     *
     * @param str
     * @param min
     * @param max
     */
    isStringNumeric(str: string, min: number, max: number): boolean {
      const trimmed = str.toString().trim();
      const num = Number.parseInt(trimmed, 10);

      return !Number.isNaN(num) && num >= min && num <= max && /^\d+$/.test(trimmed);
    },

    /**
     * Handle form submit
     */
    handleSubmit() {
      if (this.disabled || !this.isFormValid) {
        return;
      }

      const rateLimitSettings: ProjectRateLimitSettings = {
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
    margin-bottom: 10px;

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

  &__period-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__period-hint {
    margin-top: 5px;
    color: var(--color-text-second);
    font-size: 12px;
    line-height: 1.4;
  }

  &__submit-area {
    flex-basis: 100%;
  }

  &__submit-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &__clear-button {
    margin-top: 40px;
    background-color: var(--color-indicator-critical);

    &:hover {
      background-color: var(--color-indicator-critical-dark);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
