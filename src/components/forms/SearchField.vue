<template>
  <div class="form-search-field">
    <input
      class="form-search-field__input"
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

import Icon from '../Icon';

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

    &__input[type="search"] {
      padding: 9px 9px 9px 33px;
      background-color: var(--color-bg-sidebar);
      border-radius: 7px;
      &::placeholder {
        color: var(--color-text-second);
        font-size: 15px;
        opacity: 1;
      }

    }

    &__search-icon {
      position: absolute;
      top: 7px;
      left: 7px;
      box-sizing: border-box;
      width: 22px;
      height: 22px;
      padding: 4px;
      color: var(--color-text-second);
    }
  }
</style>
