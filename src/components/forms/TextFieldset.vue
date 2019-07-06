<template>
  <fieldset class="form-text-fieldset">
    <label class="form-text-fieldset__label" :for="name">{{ label}}</label>
    <input
      class="form-text-fieldset__input"
      :type="type || 'text'"
      :name="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :id="name"
      :placeholder="placeholder"
      required
    >
  </fieldset>
</template>

<script>
export default {
  name: 'FormTextFieldset',
  props: {
    name: String,
    label: String,
    placeholder: String,
    type: String,
    value: String
  }
};
</script>

<style>
  .form-text-fieldset {
    padding: 0;
    border: 0;

    &__label {
      display: block;
      margin-bottom: 9px;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
    }
  }
</style>
