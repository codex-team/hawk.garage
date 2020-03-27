<template>
  <div class="radio-button-group">
    <label
      class="label"
      v-if="label"
    >
      {{ label }}
    </label>
    <div
      v-for="(option, index) in options"
      :key="option.id"
    >
      <div
        class="radio-button-group__option"
        @click="$emit('input', option.id)"
      >
        <div
          v-if="option.image"
          class="radio-button-group__option-image"
          :style="{backgroundImage: `url('${option.image}')`}"
        ></div>
        <label
          v-if="option.name"
          class="radio-button-group__option-name"
          :for="option.id"
        >
          {{ option.name }}
        </label>

        <div
          v-if="option.label || option.description"
          class="radio-button-group__option-content"
        >
          <div
            v-if="option.label"
            class="radio-button-group__option-label"
          >
            {{ option.label }}
          </div>
          <div
            v-if="option.description"
            class="radio-button-group__option-description"
          >
            {{ option.description }}
          </div>
        </div>

        <UiRadio
          :id="option.id"
          :name="name"
          :value="option.id"
          :checked="option.id === value"
          @input="$emit('input', option.id)"
          class="radio-button-group__option-radio"
        />
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
import UiRadio from "./UiRadio";

export default {
  name: 'RadioButtonGroup',
  components: {
    UiRadio,
  },
  props: {
    label: {
      type: String,
      default: null,
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
  @import url('./../../styles/custom-properties.css');

  .radio-button-group{
    &__option {
      display: flex;
      align-items: center;
      padding: 15px 0;
      cursor: pointer;

      &-image {
        width: 33px;
        min-width: 33px;
        height: 22px;
        min-height: 22px;
        background-size: cover;
        border-radius: 3px;
        margin-right: 15px;
      }

      &-name {
        display: flex;
        line-height: 28px;
      }

      &-content {
        padding-right: 30px;
      }

      &-label {
        @apply --ui-label;
        margin-bottom: 10px;
      }

      &-description {
        font-size: 13px;
        letter-spacing: 0.16px;
        color: var(--color-text-second);
      }

      &-radio {
        margin-left: auto;
      }

      &:hover .ui-radio {
        background: var(--color-bg-sidebar);
      }
    }

    &__delimiter {
      margin: 0;
      border: 1px solid var(--color-text-second);
      opacity: 0.1;
    }
  }
</style>
