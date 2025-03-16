<template>
  <div class="form-search-field" :class="{ 'form-search-field--fancy': skin === 'fancy' }">
    <Icon
      class="form-search-field__search-icon"
      symbol="search"
    />
    <input
      class="form-search-field__input"
      type="text"
      :placeholder="placeholder"
      :value="value"
      @input="onChange"
      ref="input"
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
  data() {
    return {
      inputValue: this.value,
    };
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default() {
        return this.$t('forms.searchField');
      },
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
  created() {
    if (this.isCMDKEnabled) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  },
  beforeDestroy() {
    if (this.isCMDKEnabled) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  },
  methods: {
    onChange(event) {
      this.inputValue = event.target.value;
      this.$emit('input', event.target.value);
    },
    clearInput() {
      this.inputValue = '';
      this.$emit('input', '');
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
    align-items: center;
    padding-inline: 16px;
    border-radius: var(--border-radius);
    background-color: var(--color-bg-sidebar);
    font-size: 14px;
    gap: 8px;

    &--fancy {
      background-color: var(--color-bg-main);
      box-shadow: inset 3px 8px 14px rgba(0, 0, 0, 0.11);
      border: 1px solid transparent;
      background-image:
          linear-gradient(var(--color-bg-main), var(--color-bg-main)),
          linear-gradient(to bottom, #1B2033, #404659);
        background-origin: border-box;
        background-clip: padding-box, border-box;
    }

    &__input {
      width: 100%;
      background-color: transparent;
      border: none;
      outline: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      color: var(--color-text-main);
      line-height: 16px;
      padding: 0;
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
      cursor: pointer;
      animation: fadeIn 0.2s ease-in-out;
      color: var(--color-text-second);
      width: 22px;
      height: 22px;
      &:hover {
        color: var(--color-text-main);
      }
    }

    &__clear-icon {
      cursor: pointer;
      width: 12px;
      height: 12px;
      color: inherit;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
    }
  }
</style>
