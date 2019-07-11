<template>
  <fieldset class="custom-select">
    <label class="custom-select__label" for="customSelect">
      {{label}}
    </label>
    <div
      id="customSelect"
      class="input custom-select__select"
      @click="showDropDown = !showDropDown"
    ></div>
    <div
      class="custom-select__options-wrapper"
      v-show="showDropDown"
    >
      <div
        class="custom-select__option"
        v-for="option in options"
        :key="option.id"
        :value="option"
      >
        <EntityImage
          class="custom-select__option-image"
          :image="option.image"
          :name="option.name"
        />
        {{option.name}}
      </div>
    </div>
  </fieldset>
</template>

<script>
// если он текущий -- отображать. Если отображать весь список, если нажат select
import EntityImage from '../utils/EntityImage';

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
  },
  data() {
    return {
      showDropDown: false
    };
  },
  components: {
    EntityImage
  }
};
</script>

<style>
  .custom-select {
    position: relative;
    padding: 0;
    border: 0;
    user-select: none;

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
      font-size: 14px;
      border-radius: 3px;

      &::after {
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

    &__options-wrapper {
      position: absolute;
      top: 100%;
      width: 100%;
    }

    &__option {
      width: 100%;
      height: 40px;
      background-color: var(--color-bg-main);
    }

    &__option-image {
      display: inline-block;
      width: 28px;
      height: 28px;
      line-height: 28px;
    }
  }
</style>
