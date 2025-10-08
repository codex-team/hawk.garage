<template>
  <div class="ui-checkbox__container--labeled">
    <UiCheckbox
      :id="$id('checkbox-with-label')"
      v-model="mutableValue"
      :name="name"
      class="ui-checkbox--labeled"
    />
    <label
      :for="$id('checkbox-with-label')"
      class="ui-checkbox__label"
      v-html="label"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiCheckbox from '../UiCheckbox.vue';

export default defineComponent({
  name: 'UiCheckboxWithLabel',
  components: {
    UiCheckbox,
  },
  props: {
    /**
     * Name of the checkbox with label in form
     */
    name: {
      type: String,
      default: '',
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
    },
  },
  data() {
    return {
      /**
       * Mutable value variable for using in checkbox
       */
      mutableValue: this.value,
    };
  },
  watch: {
    /**
     * Watch on value and emit input when it's changed
     *
     * @param value - new value
     */
    mutableValue: function (value) {
      this.$emit('input', value);
    },
  },
});
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

    a {
      text-decoration: underline;

      &:hover {
        color: var(--color-text-second);
      }
    }
  }

  &__container {
    &--labeled {
      display: flex;
      align-items: center;
    }
  }
}
</style>
