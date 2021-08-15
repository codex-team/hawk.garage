<template>
  <div class="ui-checkbox__container--labeled">
    <UiCheckbox
      :id="id"
      v-model="mutableValue"
      class="ui-checkbox--labeled"
    />
    <label
      :for="id"
      class="ui-checkbox__label"
    >
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiCheckbox from '../UiCheckbox.vue';

export default Vue.extend({
  name: 'UiCheckboxWithLabel',
  components: {
    UiCheckbox
  },
  props: {
    /**
     * Id of the checkbox with label
     */
    id: {
      type: String,
      default: null,
    },

    /**
     * Value bound with v-model
     */
    value: {
      type: Boolean,
      default: null,
    },

    /**
     * Text for displaying as label
     */
    label: {
      type: String,
      default: 'Checkbox label',
    }
  },
  computed: {
    /**
     * Mutable value variable for using in checkbox
     */
    mutableValue: {
      get: function () {
        return this.value;
      },
      set: function (value) {
        this.$emit('input', value);
      }
    }
  }
})
</script>

<style>
.ui-checkbox {
  &--labeled {
    margin-right: 12px;
    margin-left: 0;
  }

  &__label {
    cursor: pointer;
    user-select: none;
  }

  &__container {
    &--labeled {
      display: flex;
      align-items: center;
    }
  }
}
</style>
