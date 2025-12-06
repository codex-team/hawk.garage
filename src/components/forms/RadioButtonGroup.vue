<template>
  <div class="radio-button-group">
    <label
      v-if="label"
      class="label"
    >
      {{ label }}
    </label>
    <div
      v-for="(option, index) in options"
      :key="option.id"
    >
      <div
        class="radio-button-group__option"
        @click="select(option.id)"
      >
        <div
          v-if="option.image"
          class="radio-button-group__option-image"
          :style="{backgroundImage: `url('${option.image}')`}"
        />
        <label
          v-if="option.name"
          class="radio-button-group__option-name"
          :for="option.id"
        >
          {{ option.name }}
        </label>

        <div
          v-if="option.label || option.description"
          class="radio-button-group__option-content"
        >
          <div
            v-if="option.label"
            class="radio-button-group__option-label"
          >
            {{ option.label }}
          </div>
          <div
            v-if="option.description"
            class="radio-button-group__option-description"
          >
            <div v-if="option.description !== undefined">
              {{ option.description }}
            </div>
          </div>
          <slot
            v-else
            name="description"
            :option="option"
          />
        </div>

        <UiRadio
          :id="option.id"
          :name="name"
          :model-value="option.id"
          :checked="option.id === currentValue"
          class="radio-button-group__option-radio"
          @update:model-value="select(option.id)"
        />
      </div>
      <hr
        v-if="index !== options.length - 1"
        class="radio-button-group__delimiter"
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiRadio from './UiRadio.vue';

/**
 * Represents single item of radio button group
 */
export interface RadioButtonGroupItem {
  /**
   * Item value
   */
  id: string;

  /**
   * Image for showing with item, see Account/Appearance/Language
   */
  image?: string;

  /**
   * Text on item.
   */
  name?: string;

  /**
   * Label for item. Can be used instead of 'name', see Project/Settings/Notifications/AddRule
   */
  label?: string;

  /**
   * Description shown below the label
   */
  description?: string;
}

export default defineComponent({
  name: 'RadioButtonGroup',
  components: {
    UiRadio,
  },
  props: {
    label: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => RadioButtonGroupItem[],
      required: true,
    },
    modelValue: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    currentValue(): string | undefined {
      if (this.modelValue !== undefined) {
        return this.modelValue;
      }

      return this.modelValue;
    },
  },
  methods: {
    select(optionId: string) {
      this.$emit('update:modelValue', optionId);
    },
  },
});
</script>

<style>
  @import './../../styles/custom-properties.css';

  .radio-button-group{
    &__option {
      display: flex;
      align-items: center;
      padding: 15px 0;
      cursor: pointer;

      &-image {
        width: 33px;
        min-width: 33px;
        height: 22px;
        min-height: 22px;
        margin-right: 15px;
        background-size: cover;
        border-radius: 3px;
      }

      &-name {
        display: flex;
        line-height: 28px;
      }

      &-content {
        padding-right: 30px;
      }

      &-label {
        @mixin ui-label;
        margin-bottom: 7px;
      }

      &-description {
        color: var(--color-text-second);
        font-size: 13px;
        line-height: 1.6em;
        letter-spacing: 0.16px;
      }

      &-radio {
        margin-left: auto;
      }

      &:hover .ui-radio {
        background: var(--color-bg-sidebar);
      }
    }

    &__delimiter {
      height: 0;
      margin: 0;
      border: 0;
      border-bottom: 1px solid var(--color-delimiter-line);
    }
  }
</style>
