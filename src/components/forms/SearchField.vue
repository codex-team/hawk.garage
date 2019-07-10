<template>
  <div class="form-search-field">
    <input
      class="input form-search-field__input"
      type="search"
      placeholder="Search"
    >
    <Icon
      class="form-search-field__search-icon"
      symbol="search"
    />
  </div>
</template>

<script>

import Icon from '../utils/Icon';

export default {
  name: 'FormSearchField',
  components: {
    Icon
  }
};
</script>

<style>
  .form-search-field {
    position: relative;

    &__input {
      height: 36px;
      padding: 9px 9px 9px 33px;
      background-color: var(--color-bg-sidebar);
      border: none;
      border-radius: 7px;

      &::placeholder {
        color: var(--color-text-second);
        font-size: 15px;
        opacity: 1;
      }

    }

    &__search-icon {
      position: absolute;
      top: 9.5px;
      left: 11px;
      width: 15px;
      height: 15px;
      color: var(--color-text-second);
    }
  }
</style>
