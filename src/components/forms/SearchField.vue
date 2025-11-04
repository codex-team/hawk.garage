<template>
  <div
    class="form-search-field"
    :class="{ 'form-search-field--fancy': skin === 'fancy' }"
  >
    <Icon
      class="form-search-field__search-icon"
      symbol="search"
    />
    <input
      ref="input"
      class="form-search-field__input"
      type="text"
      :placeholder="placeholderText"
      :value="modelValue"
      @input="onChange"
    >
    <div
      v-show="inputValue"
      class="form-search-field__clear-icon-wrapper"
      @click="clearInput"
    >
      <Icon
        class="form-search-field__clear-icon"
        symbol="close"
      />
    </div>
  </div>
</template>

<script>
import Icon from '../utils/Icon';

export default {
  name: 'FormSearchField',
  components: {
    Icon,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: null,
    },
    skin: {
      type: String,
      default: 'default',
      validator(value) {
        return ['default', 'fancy'].includes(value);
      },
    },
    isCMDKEnabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: this.modelValue,
    };
  },
  computed: {
    placeholderText() {
      return this.placeholder || this.$t('forms.searchField');
    },
  },
  created() {
    if (this.isCMDKEnabled) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  },
  beforeUnmount() {
    if (this.isCMDKEnabled) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  },
  methods: {
    onChange(event) {
      this.inputValue = event.target.value;
      this.$emit('update:modelValue', event.target.value);
    },
    clearInput() {
      this.inputValue = '';
      this.$emit('update:modelValue', '');
      this.$refs.input.focus();
    },
    handleKeyDown(event) {
      const isCmd = event.metaKey || event.ctrlKey;

      if (isCmd && event.key === 'k') {
        this.$refs.input.focus();
        this.$refs.input.scrollIntoView({ behavior: 'smooth' });
      }
    },
  },
};
</script>

<style>
  .form-search-field {
    position: relative;
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    background-color: var(--color-bg-sidebar);
    border-radius: var(--border-radius);
    padding-inline: 16px;

    &--fancy {
      background-color: var(--color-bg-main);
      background-image:
          linear-gradient(var(--color-bg-main), var(--color-bg-main)),
          linear-gradient(to bottom, #1B2033, #404659);
        background-clip: padding-box, border-box;
        background-origin: border-box;
      border: 1px solid transparent;
      box-shadow: inset 3px 8px 14px rgba(0, 0, 0, 0.11);
    }

    &__input {
      width: 100%;
      padding: 0;
      color: var(--color-text-main);
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
      line-height: 16px;
      background-color: transparent;
      border: none;
      outline: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      padding-block: 11px;

      &::placeholder {
        color: var(--color-text-second);
        font-size: inherit;
        opacity: 1;
      }

    }

    &__search-icon {
      width: 14px;
      height: 14px;
      color: var(--color-text-second);
    }

    &__clear-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      color: var(--color-text-second);
      cursor: pointer;
      animation: fadeIn 0.2s ease-in-out;
      &:hover {
        color: var(--color-text-main);
      }
    }

    &__clear-icon {
      width: 12px;
      height: 12px;
      color: inherit;
      cursor: pointer;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
    }
  }
</style>
