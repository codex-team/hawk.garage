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
        v-if="needImage && currentValue && currentValue.id"
        :id="currentValue.id || '1'"
        class="custom-select__option-image"
        :image="currentValue.image"
        :name="currentValue.name"
        size="28"
      />
      <Icon
        v-else-if="currentValue && currentValue.icon"
        class="custom-select__icon"
        :symbol="currentValue.icon"
      />
      <span
        v-if="currentValue && currentValue.name"
        class="custom-select__text"
      >{{ currentValue.name }}</span>
      <span
        v-else
        class="custom-select__placeholder"
      >{{ placeholder }}</span>
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
          @click="$emit('update:modelValue', option)"
        >
          <EntityImage
            v-if="needImage"
            :id="option.id"
            class="custom-select__option-image"
            :image="option.image"
            :name="option.name"
            size="28"
          />
          <Icon
            v-else-if="option.icon"
            class="custom-select__icon"
            :symbol="option.icon"
          />
          <span class="custom-select__text">{{ option.name }}</span>
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
    Icon,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Object,
      default: () => null,
    },
    label: {
      type: String,
      required: true,
    },
    needImage: {
      type: Boolean,
      default: true,
    },
    /**
     * Placeholder text shown when no option is selected
     */
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpened: false,
    };
  },
  computed: {
    currentValue() {
      return this.modelValue ?? {};
    },
    filteredOption() {
      const currentId = this.currentValue && this.currentValue.id;

      return this.options.filter(opt => opt.id !== currentId);
    },
  },
  methods: {
    /**
     * Close select
     */
    close() {
      this.isOpened = false;
    },
  },
}
;
</script>

<style>
  .custom-select {
    position: relative;
    padding: 0;
    border: 0;
    user-select: none;
    width: 100%;
    min-width: 100%;

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
      z-index: 2;
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

      &.options-appear-enter-from,
      &.options-appear-leave-to {
        transform: translateY(-10px);
      }

      &.options-appear-enter-to,
      &.options-appear-leave-from {
        transform: none;
      }
    }

    &__option, &__select {
      display: flex;
      align-items: center;
      width: 100%;
      min-width: 100%;
      height: 40px;
      padding: 0 0 0 12px;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &--opened &__select {
      z-index: 3;
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
      margin-right: 6px;
      flex-shrink: 0;
    }

    &__icon {
      width: 18px;
      height: 18px;
      margin-right: 8px;
      flex-shrink: 0;
      border-radius: 50%;
    }

    &__text {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__placeholder {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text-second);
    }
  }
</style>
