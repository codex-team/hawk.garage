<template>
  <form class="rate-limits-form" @submit.prevent="handleSubmit">
    <div class="rate-limits-form__fields">
      <TextFieldset
        v-model="selectedThreshold"
        type="number"
        :required="true"
        :disabled="disabled"
        :is-invalid="!/^[1-9]\d*$/.test(selectedThreshold.toString())"
        :label="$t('projects.settings.rateLimits.threshold')"
        @input="onInput"
      />
      <TextFieldset
        v-model="periodSeconds"
        type="number"
        :required="true"
        :disabled="disabled"
        :is-invalid="!/^[1-9]\d*$/.test(periodSeconds.toString())"
        :label="$t('projects.settings.rateLimits.period')"
        @input="onInput"
      />
    </div>

    <div class="rate-limits-form__submit-area">
      <button
        v-if="showSubmitButton && !disabled"
        class="button button--submit rate-limits-form__submit-button"
        type="submit"
      >
        {{ $t('projects.settings.rateLimits.submit') }}
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue';
import TextFieldset from './TextFieldset.vue';
import { ProjectRateLimitSettings } from '../../types/project';

export interface RateLimitsFormData {
  N: number;
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
  },
  data() {
    return {
      selectedThreshold: this.value?.N?.toString() || '3000',
      periodSeconds: this.value?.T?.toString() || '60',
      showSubmitButton: false,
    };
  },
  watch: {
    value: {
      handler(newValue: ProjectRateLimitSettings | null | undefined) {
        if (newValue) {
          this.selectedThreshold = newValue.N?.toString() || '3000';
          this.periodSeconds = newValue.T?.toString() || '60';
        }
      },
      immediate: true,
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
      if (this.disabled) {
        return;
      }

      const rateLimitSettings: RateLimitsFormData = {
        N: Number.parseInt(this.selectedThreshold, 10),
        T: Number.parseInt(this.periodSeconds, 10),
      };

      this.$emit('submit', rateLimitSettings);
      this.showSubmitButton = false;
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
    margin: 0 0 20px 0;
  }
}
</style>
