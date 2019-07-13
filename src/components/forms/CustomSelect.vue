<template>
  <fieldset
    v-click-outside="close"
    class="custom-select"
    :class="{'custom-select--opened': isOpened}"
    @click="isOpened = !isOpened"
  >
    <label class="custom-select__label">
      {{ label }}
    </label>
    <div
      class="input custom-select__select"
    >
      <EntityImage
        :id="value.id"
        class="custom-select__option-image"
        :image="value.image"
        :name="value.name"
      />
      {{ value.name }}
      <Icon
        class="custom-select__expand-icon"
        symbol="arrow-down"
      />
    </div>
    <transition name="options-appear">
      <div
        v-show="isOpened"
        class="custom-select__options-wrapper"
      >
        <div
          v-for="option in filteredOption"
          :key="option.id"
          class="custom-select__option"
          @click="$emit('input', option)"
        >
          <EntityImage
            :id="option.id"
            class="custom-select__option-image"
            :image="option.image"
            :name="option.name"
          />
          {{ option.name }}
        </div>
      </div>
    </transition>
  </fieldset>
</template>

<script>
import Icon from '../utils/Icon';
import EntityImage from '../utils/EntityImage';

export default {
  name: 'CustomSelect',
  components: {
    EntityImage,
    Icon
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Object,
      default: () => {}
    },
    label: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isOpened: false
    };
  },
  computed: {
    filteredOption() {
      return this.options.filter(opt => opt !== this.value);
    }
  },
  methods: {
    /**
     * Close select
     */
    close() {
      this.isOpened = false;
    }
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
      z-index: 1;
    }

    &__expand-icon {
      position: absolute;
      top: 50%;
      right: 12px;
      width: 18px;
      height: 10px;
      transform: translateY(-50%);
    }

    &__options-wrapper {
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      margin-top: -5px;
      padding-top: 5px;
      background-color: var(--color-bg-main);
      border: 1px solid var(--color-border-input);
      border-top: none;
      border-bottom-right-radius: 3px;
      border-bottom-left-radius: 3px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
      transition: transform 120ms cubic-bezier(0.29, 0.97, 0.82, 1.43);
      will-change: transform;

      &.options-appear-leave-active {
        transition: none;
      }

      &.options-appear-enter,
      &.options-appear-leave-to {
        transform: translateY(-10px);
      }

      &.options-appear-enter-to,
      &.options-appear-leave {
        transform: none;
      }
    }

    &__option, &__select {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 0 0 12px;
      font-size: 14px;
      cursor: pointer;
    }

    &--opened &__select {
      border-bottom: 1px solid transparent;
      border-bottom-right-radius: unset;
      border-bottom-left-radius: unset;
    }

    &--opened &__option,
    &--opened &__select {
      &:hover {
        background-color: var(--color-bg-sidebar);
      }
    }

    &--opened &__expand-icon {
      transform: rotate(180deg) translateY(50%);
    }

    &__option-image {
      display: inline-block;
      width: 28px;
      height: 28px;
      margin-right: 6px;
      font-size: 13px;
      line-height: 28px;
    }
  }
</style>
