<template>
  <div class="radio-button-group">
    <label class="label">{{ label }}</label>
    <div
      v-for="option in options"
      :key="option.id"
      class="radio-button-group__option"
    >
      <input
        :id="option.id"
        :value="option.id"
        :checked="option.id === value"
        class="radio-button-group__option-input"
        :name="name"
        type="radio"
        @input="$emit('input', option.id)"
      >
      <label
        class="radio-button-group__option-label"
        :style="{backgroundImage: `url('${option.image}')`}"
        :for="option.id"
      >
        {{ option.name }}
      </label>
      <div
        class="radio-button-group__option-tick"
        @click="$emit('input', option.id)"
      >
        <Icon symbol="tick" />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon';

export default {
  name: 'RadioButtonGroup',
  components: { Icon },
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
  .radio-button-group{
    &__option {
      padding: 15px;
      display: flex;
    }

    &__option-label {
      width: 100%;
      display: flex;
      padding-left: 50px;
      line-height: 28px;
      background-repeat: no-repeat;
      background-size: 33px 100%;
    }

    &__option-input {
      opacity: 0;
      position: fixed;
      width: 0;

      &:checked ~ .radio-button-group__option-tick .icon {
        display: block;
      }

      &:focus ~ .radio-button-group__option-tick{
        border-width: 2px;
      }
    }

    &__option-tick {
      margin-left: auto;
      width: 28px;
      height: 28px;
      min-width: 28px;
      min-height: 28px;
      border: 1px solid var(--color-bg-sidebar);
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--color-bg-main);

      .icon {
        display: none;
        width: 18px;
        padding: 3px;
        background-color: #09cf5d;
        border-radius: 100%;
        height: 18px;
      }
    }
  }
</style>
