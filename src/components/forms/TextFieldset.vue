<template>
  <fieldset class="fieldset form-text-fieldset">
    <label
      class="label form-text-fieldset__label"
      :for="name"
    >
      {{ label }}
    </label>
    <input
      :id="name"
      class="input form-text-fieldset__input"
      :type="type || 'text'"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      required
      @input="$emit('input', $event.target.value)"
    >
  </fieldset>
</template>

<script>
export default {
  name: 'FormTextFieldset',
  props: {
    name: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      default: null
    }
  }
};
</script>

<style>
  .form-text-fieldset {
    &__label {
      margin-bottom: 9px;
    }
  }
</style>
