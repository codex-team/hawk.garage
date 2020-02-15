<template>
  <div class="radio-button-group">
    <label class="label">{{ label }}</label>
    <div
      v-for="(option, index) in options"
      :key="option.id"
    >
      <div
        class="radio-button-group__option"
        @click="$emit('input', option.id)"
      >
        <div
          class="radio-button-group__option-image"
          :style="{backgroundImage: `url('${option.image}')`}"
        />
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
          :for="option.id"
        >
          {{ option.name }}
        </label>
        <div
          class="radio-button-group__option-tick"
        >
          <Icon symbol="tick" />
        </div>
      </div>
      <hr
        v-if="index !== options.length - 1"
        class="radio-button-group__delimiter"
      >
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
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
  .radio-button-group{
    &__option {
      display: flex;
      align-items: center;
      padding: 15px 0;
      cursor: pointer;
    }

    &__option-image {
      width: 33px;
      min-width: 33px;
      height: 22px;
      min-height: 22px;
      background-size: cover;
      border-radius: 3px;
    }

    &__option-label {
      display: flex;
      padding-left: 15px;
      line-height: 28px;
      background-repeat: no-repeat;
      background-size: 33px 100%;
    }

    &__option-tick {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      min-width: 28px;
      height: 28px;
      min-height: 28px;
      margin-left: auto;
      background: var(--color-bg-main);
      border: 1px solid var(--color-bg-sidebar);
      border-radius: 100%;

      .icon {
        display: none;
        width: 18px;
        height: 18px;
        padding: 3px;
        background-color: #09cf5d;
        border-radius: 100%;
      }
    }

    &__option-input {
      position: fixed;
      width: 0;
      opacity: 0;

      &:focus ~ .radio-button-group__option-tick{
        border-width: 2px;
      }

      &:checked ~ .radio-button-group__option-tick .icon {
        display: block;
      }
    }

    &__delimiter {
      margin: 0;
      border: 1px solid var(--color-text-second);
      opacity: 0.1;
    }
  }
</style>
