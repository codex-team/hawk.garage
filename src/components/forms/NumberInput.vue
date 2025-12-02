<template>
  <fieldset class="form-fieldset form-fieldset__width" :class="{ 'form-fieldset--invalid': isInvalid }">
    <label
      class="label form-fieldset__label"
      :for="name"
    >
      {{ label }}
    </label>
    <input
      :id="name"
      class="input form-fieldset__input"
      type="number"
      :name="name"
      :value="value"
      :min="min"
      :max="max"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
      @beforeinput="handleBeforeInput"
      @paste="handlePaste"
      ref="input"
    >
    <div
      class="form-fieldset__error-message"
    >
      {{ errorMessage }}
    </div>
  </fieldset>
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    /**
     * Name of input
     */
    name: {
      type: String,
      default: null,
    },

    /**
     * Label for input
     */
    label: {
      type: String,
      default: null,
    },

    /**
     * Placeholder shown on input
     */
    placeholder: {
      type: String,
      default: null,
    },

    /**
     * Value for v-model
     */
    value: {
      type: [String, Number],
      default: null,
    },

    /**
     * Is the input required to fill
     */
    required: Boolean,

    /**
     * Disable input field
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Minimum value for number type
     */
    min: {
      type: Number,
      default: null,
    },

    /**
     * Maximum value for number type
     */
    max: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      isInvalid: false,
      validationError: null,
    };
  },
  computed: {
    errorMessage() {
      if (!this.isInvalid || !this.validationError) {
        return null;
      }

      if (this.validationError === 'min') {
        return this.$t('forms.numberInput.minError', { min: this.min });
      }

      if (this.validationError === 'max') {
        return this.$t('forms.numberInput.maxError', { max: this.max });
      }

      return null;
    },
  },
  methods: {
    updateInvalidState(value) {
      if (this.min && value < this.min) {
        this.isInvalid = true;
        this.validationError = 'min';
      } else if (this.max && value > this.max) {
        this.isInvalid = true;
        this.validationError = 'max';
      } else {
        this.isInvalid = false;
        this.validationError = null;
      }
    },
    handleInput(event) {
      this.$emit('input', event.target.value);
      this.updateInvalidState(event.target.value);
    },
    handleBeforeInput(event) {
      if (event.data && event.data.match(/[^0-9]/)) {
        event.preventDefault();
      }
    },
    handlePaste(event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('text');

      /**
       * Remove all non-numeric characters from the pasted data
       * and set the value to the input
       */
      const numericData = pastedData.replace(/[^0-9]/g, '');

      if (numericData) {
        this.$emit('input', numericData);
        this.updateInvalidState(numericData);
      }
      event.preventDefault();
    },
  },
}
</script>

<style>
  .form-fieldset {
    margin: 0;
    padding: 0;
    border: none;

    &__width {
      min-width: 180px;
    }

    &__label {
      margin-bottom: 10px;
    }

    &__input::-webkit-outer-spin-button,
    &__input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    &__input {
      -moz-appearance: textfield;
    }

    &--invalid &__input {
      border-color: var(--color-indicator-critical);
      box-shadow: 0 1px 10px color-mod(var(--color-indicator-critical) alpha(35%));
    }

    &__error-message {
      max-width: 180px;
      color: var(--color-indicator-critical);
      font-size: 13px;
      line-height: 20px;
    }
  }
</style>
