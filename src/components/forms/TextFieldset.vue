<template>
  <fieldset class="form-fieldset">
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
      {{ description }}
    </div>
    <input
      :id="name"
      class="input form-fieldset__input"
      :type="type || 'text'"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      :required="required"
      @input="$emit('input', $event.target.value)"
    >
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
      margin-bottom: 10px;
      color: var(--color-text-second);
      font-size: 13px;
      letter-spacing: 0.16px;
    }
  }
</style>
