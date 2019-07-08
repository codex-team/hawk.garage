<template>
  <fieldset class="custom-select">
    <label class="custom-select__label" for="selectWorkspace">{{label}}</label>
    <div
      class="custom-select__wrapper"
    >
      <select
        id="selectWorkspace"
        class="custom-select__select"
        :value="value"
        @input="$emit('input', $event.target.value)"
      >
        <option
          v-for="option in options"
          :key="option.id"
          :value="option.id"
        >
          {{option.name}}
        </option>
      </select>
    </div>
  </fieldset>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: String,
    label: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
  .custom-select {
    box-sizing: border-box;
    margin: 0 0 20px;
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

    &__select {
      position: relative;
      width: 100%;
      height: 40px;
      padding-left: 12px;
      color: var(--color-text-main);
      font-size: 14px;
      background: var(--color-bg-main);
      border: 1px solid var(--color-border-input);
      border-radius: 3px;
      outline: none;
      appearance: none;

      &::-ms-expand {
        display: none;
      }

      &:focus {
        box-shadow: 0 0 0 1px var(--color-indicator-medium);
      }

      option {
        min-height: 40px;
      }
    }

    &__wrapper {

      position: relative;
      width: 280px;

      &:after {
        position: absolute;
        top: 9px;
        right: 17px;
        display: block;
        width: 12px;
        height: 12px;
        border: 3px solid var(--color-text-main);
        border-bottom: none;
        border-left: none;
        border-radius: 3px;
        transform: rotate(-225deg);
        content: '';
      }
    }
  }
</style>
