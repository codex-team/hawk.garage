<template>
  <div class="ui-checkbox__container--labeled">
    <UiCheckbox
      :id="checkboxId"
      v-model="mutableValue"
      :name="name"
      class="ui-checkbox--labeled"
    />
    <label
      :for="checkboxId"
      class="ui-checkbox__label"
      v-html="label"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, useId } from 'vue';
import UiCheckbox from '../UiCheckbox.vue';

/**
 * Props for the component
 */
interface Props {
  /**
   * Name of the checkbox with label in form
   */
  name?: string;

  /**
   * Value bound with v-model
   */
  modelValue?: boolean | null;

  /**
   * Text for displaying as label
   */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  modelValue: null,
  label: 'Checkbox label',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean | null];
}>();

/**
 * Generate unique ID for checkbox using Vue 3 useId()
 */
const checkboxId = useId();

/**
 * Mutable value variable for using in checkbox
 * Convert null to undefined for v-model compatibility
 */
const mutableValue = ref<boolean | undefined>(props.modelValue ?? undefined);

/**
 * Watch on value and emit input when it's changed
 */
watch(mutableValue, (value) => {
  emit('update:modelValue', value ?? null);
});

/**
 * Watch on modelValue prop changes and update mutableValue
 */
watch(() => props.modelValue, (value) => {
  mutableValue.value = value ?? undefined;
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
