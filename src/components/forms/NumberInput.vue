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
    };
  },
  methods: {
    updateInvalidState(value) {
      this.isInvalid = (this.min !== null && value < this.min) ||
                       (this.max !== null && value > this.max);
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
      min-width: 170px;
    }

    &__label {
      margin-bottom: 10px;
    }

    &--invalid &__input {
      border-color: var(--color-indicator-critical);
      box-shadow: 0 1px 10px color-mod(var(--color-indicator-critical) alpha(35%));
    }
  }
</style>
