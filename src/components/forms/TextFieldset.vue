<template>
  <fieldset
    class="form-fieldset"
    :class="{
      'form-fieldset--with-hidden-input': hidden,
      'form-fieldset--invalid': isInvalid,
    }"
  >
    <label
      class="label form-fieldset__label"
      :for="name"
    >
      {{ label }}
    </label>
    <div
      v-if="description"
      class="form-fieldset__description"
    >
      <!-- eslint-disable vue/no-v-html -->
      <span v-html="description" />
    </div>
    <input
      :id="name"
      :autocomplete="autoComplete"
      class="input form-fieldset__input"
      :type="type || 'text'"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :required="required"
      :hidden="hidden"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="handleInput"
      @keypress="$emit('keypress', $event)"
    />
  </fieldset>
</template>

<script>
export default {
  name: 'FormTextFieldset',
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
     * Input type
     */
    type: {
      type: String,
      default: 'text',
    },

    /**
     * Value for v-model
     */
    value: {
      type: String,
      default: null,
    },

    /**
     * Is the input required to fill
     */
    required: Boolean,

    /**
     * Description for input
     */
    description: {
      type: String,
      default: null,
    },

    /**
     * Allows to hide input for some cases
     * For example, if some checkbox is not enabled, like in NotificationsAddRule
     */
    hidden: {
      type: Boolean,
      default: false,
    },

    /**
     * If true, field will be styled as invalid
     */
    isInvalid: {
      type: Boolean,
      default: false,
    },

    /**
     * Enables autocomplete in input field
     */
    autoComplete: {
      type: String,
      default: 'on',
    },

    /**
     * Disable input field
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: Number,
      default: undefined,
    },
  },
  methods: {
    /**
     * Handle input event and enforce maxlength if provided
     */
    handleInput(event) {
      let value = event.target.value;

      // Enforce maxlength for number inputs (browsers ignore maxlength for type="number")
      if (
        this.maxlength !== undefined &&
        this.maxlength !== null &&
        value.length > this.maxlength
      ) {
        value = value.slice(0, this.maxlength);
        event.target.value = value;
      }

      this.$emit('input', value);
    },
  },
};
</script>

<style>
  .form-fieldset {
    margin: 0;
    padding: 0;
    border: none;

    &__label {
      margin-bottom: 10px;
    }

    &__description {
      margin-top: -3px;
      margin-bottom: 10px;
      color: var(--color-text-second);
      font-size: 13px;
      line-height: 1.6em;
      letter-spacing: 0.16px;
    }

    &--with-hidden-input &__description {
      margin-bottom: 0;
    }

    &--invalid &__input {
      border-color: var(--color-indicator-critical);
      box-shadow: 0 1px 10px color-mod(var(--color-indicator-critical) alpha(35%));
    }
  }
</style>
