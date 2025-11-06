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
      :placeholder="placeholder"
      :value="value"
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
import { debounce } from '@/utils';

export default {
  name: 'FormSearchField',
  components: {
    Icon,
  },
  props: {
    value: {
      type: String,
      default: '',
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
    /**
     * Project id to commit search into store
     */
    projectId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      inputValue: this.value,
      debouncedSearch: null,
    };
  },
  created() {
    if (this.isCMDKEnabled) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
    const SEARCH_MAX_LENGTH = 50;
    this.debouncedSearch = debounce((query) => {
      const sanitized = typeof query === 'string' ? query.slice(0, SEARCH_MAX_LENGTH) : '';

      if (this.projectId) {
        this.$store.commit('SET_PROJECT_SEARCH', {
          projectId: this.projectId,
          search: sanitized,
        });
      }

      this.$emit('search', sanitized);
    }, 500);
  },
  beforeDestroy() {
    if (this.isCMDKEnabled) {
      document.removeEventListener('keydown', this.handleKeyDown);
    }
    this.debouncedSearch && this.debouncedSearch.cancel && this.debouncedSearch.cancel();
  },
  methods: {
    onChange(event) {
      this.inputValue = event.target.value;
      this.$emit('input', event.target.value);
      this.debouncedSearch && this.debouncedSearch(this.inputValue);
    },
    clearInput() {
      this.inputValue = '';
      this.$emit('input', '');
      this.$refs.input.focus();
      this.debouncedSearch && this.debouncedSearch('');
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
