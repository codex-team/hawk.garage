<template>
  <fieldset class="fieldset form-text-fieldset">
    <label
      class="label form-text-fieldset__label"
      :for="name"
    >
      {{ label}}
    </label>
    <input
      class="input form-text-fieldset__input"
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
    &__label {
      margin-bottom: 9px;
    }
  }
</style>
