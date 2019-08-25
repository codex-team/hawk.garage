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
        :name="name"
        type="radio"
      >
      <label
        class="radio-button-group__option-label"
        :style="{backgroundImage: `url('${option.image}')`}"
        :for="option.id"
      >
        {{ option.name }}
        <div class="radio-button-group__option-tick">
          <Icon symbol="tick" />
        </div>
      </label>
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
    }
  }
};
</script>

<style>
  .radio-button-group{
    &__option-label {
      display: flex;
      padding-left: 50px;
      line-height: 28px;
      background-repeat: no-repeat;
      background-size: 33px 100%;
    }

    &__option-tick {
      margin-left: auto;
      width: 28px;
      height: 28px;
      border: 1px solid var(--color-bg-sidebar);
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--color-bg-main);

      .icon {
        width: 18px;
        height: 18px;
      }
    }
  }
</style>
