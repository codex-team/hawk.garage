<template>
  <fieldset
    class="custom-select"
    :class="{'custom-select--opened':showDropDown}"
    @click="onSelectClick"
  >
    <label class="custom-select__label">
      {{label}}
    </label>
    <div
      class="input custom-select__select"
    >
      <EntityImage
        class="custom-select__option-image"
        :image="value.image"
        :name="value.name"
        :id="value.id"
      />
      {{value.name}}
      <Icon class="custom-select__expand-icon" symbol="expand"/>
    </div>
    <div
      class="custom-select__options-wrapper"
      v-show="showDropDown"
    >
      <div
        class="custom-select__option"
        v-for="option in filteredOption"
        :key="option.id"
        @click="$emit('input', option)"
      >
        <EntityImage
          class="custom-select__option-image"
          :image="option.image"
          :name="option.name"
          :id="option.id"
        />
        {{option.name}}
      </div>
    </div>
  </fieldset>
</template>

<script>
  import Icon from '../utils/Icon';
import EntityImage from '../utils/EntityImage';

export default {
  name: 'CustomSelect',
  props: {
    options: {
      type: Array,
      required: true
    },
    value: Object,
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
  methods: {
    onSelectClick() {
      this.showDropDown = !this.showDropDown;
    },
    close() {
      this.showDropDown = false;
    }
  },
  watch: {
    showDropDown(newValue) {
      if (newValue) {
        setTimeout(() => {
          window.addEventListener('click', this.close);
          window.addEventListener('touchstart', this.close);
        }, 0);
      } else {
        window.removeEventListener('click', this.close);
        window.removeEventListener('touchstart', this.close);
      }
    }
  },
  computed: {
    filteredOption() {
      return this.options.filter(opt => opt !== this.value);
    }
  },
  components: {
    EntityImage,
    Icon
  }
}
;
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
    }

    &__expand-icon {
      position: absolute;
      top: 14px;
      right: 17px;
      width: 18px;
      height: 10px;
    }

    &__options-wrapper {
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      border: 1px solid var(--color-border-input);
      border-top: none;
      border-bottom-right-radius: 3px;
      border-bottom-left-radius: 3px;
    }

    &__option, &__select {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 0 0 12px;
      font-size: 14px;
      background-color: var(--color-bg-main);
    }

    &--opened &__select {
      border-bottom: none;
      border-bottom-right-radius: unset;
      border-bottom-left-radius: unset;
    }

    &--opened &__option,
    &--opened &__select {
      &:hover {
        background-color: var(--color-bg-sidebar);
      }
    }

    &__option-image {
      display: inline-block;
      width: 28px;
      height: 28px;
      margin-right: 5px;
      font-size: 13px;
      line-height: 28px;
    }
  }
</style>
