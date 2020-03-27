<template>
  <div class="ui-radio">
    <input
      :id="id"
      :value="value"
      :checked="checked"
      :name="name"
      type="radio"
      @input="$emit('input', value)"
    >
    <Icon symbol="tick" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../utils/Icon.vue';

export default Vue.extend({
  name: 'UiRadio',
  components: {
    Icon,
  },
  props: {
    /**
     * Id of the input. Can be used to connect label
     */
    id: {
      type: String,
      default: null,
    },

    /**
     * Name of the radio button input
     */
    name: {
      type: String,
      default: null,
    },

    /**
     * Value binded with v-model
     */
    value: {
      type: String,
      default: null,
    },

    /**
     * Checked state
     */
    checked: {
      type: Boolean,
      default: false,
    },
  }
});
</script>

<style>
  .ui-radio {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    min-width: 28px;
    height: 28px;
    min-height: 28px;
    margin-left: auto;
    background: var(--color-bg-main);
    border: 1px solid var(--color-bg-sidebar);
    color: #fff;
    border-radius: 100%;
    cursor: pointer;

    .icon {
      width: 18px;
      height: 18px;
      padding: 3px;
      background-color: #09cf5d;
      border-radius: 100%;
      opacity: 0;
    }

    &:hover {
      background: var(--color-bg-sidebar);
    }

    input {
      display: none;

      &:checked ~ .icon {
        opacity: 1;
      }
    }
  }
</style>
