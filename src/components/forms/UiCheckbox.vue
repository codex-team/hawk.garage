<template>
  <div class="ui-checkbox" @click="clicked">
    <input
      :id="id"
      :checked="value"
      :name="name"
      type="checkbox"
    >
    <Icon symbol="tick" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from '../utils/Icon.vue';

export default Vue.extend({
  name: 'UiCheckbox',
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
      type: Boolean,
      default: null,
    },

    /**
     * Checked state
     */
    checked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clicked(){
      this.$emit('input', !this.value);
    }
  }
});
</script>

<style>
  .ui-checkbox {
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
    border-radius: 4px;
    cursor: pointer;

    .icon {
      width: 18px;
      height: 18px;
      padding: 3px;
      background-color: #09cf5d;
      border-radius: 2px;
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
