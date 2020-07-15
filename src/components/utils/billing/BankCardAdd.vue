<template>
  <div class="bank-card-add">
    <Icon
      class="bank-card-add__icon"
      symbol="plus"
    />
    {{ label }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../Icon.vue';

/**
 * "Add a new card" button component
 */
export default Vue.extend({
  name: 'BankCardAdd',
  components: {
    Icon,
  },
  props: {
    /**
     * Button text
     */
    label: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
  .bank-card-add {
    display: inline-flex;
    align-items: center;
    height: 40px;
    padding: 13px;
    color: var(--color-text-second);
    font-size: 12px;
    letter-spacing: 0.15px;
    text-transform: uppercase;
    border: 1px dashed var(--color-text-second);
    border-radius: 8px;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: var(--color-text-main);
      border-color: var(--color-text-main);
    }

    &__icon {
      width: 16px;
      height: 16px;
      margin-right: 11px;
    }
  }
</style>
