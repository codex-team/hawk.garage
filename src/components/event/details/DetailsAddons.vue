<template>
  <DetailsBase>
    <template #header>
      {{ title }}
      <template v-if="title === 'Vue' ">
        <Icon symbol="vue" />
      </template>
    </template>
    <template #content>
      <div
        v-for="(value, key) in addons"
        :key="key"
        class="event-details__content-block"
      >
        <div class="event-details__key">
          {{ key }}
        </div>
        <div class="event-details__value">
          <Json
            v-if="isObject(value) && !isCustomRenderer(key)"
            :value="value"
          />
          <CodeBlock
            v-else-if="isHTML(key)"
            language="html"
            class="event-details__single-line-code"
          >
            {{ value }}
          </CodeBlock>
          <template v-else>
            {{ renderAddonValue(key, value) }}
          </template>
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import Vue from 'vue';
import DetailsBase from './DetailsBase.vue';
import Icon from '../../utils/Icon.vue';
import { isObject } from '@/utils';
import Json from '../../utils/Json.vue';
import CodeBlock from '../../utils/CodeBlock.vue';

/**
 * Details addons component
 */
export default Vue.extend({
  name: 'DetailsAddons',
  components: {
    DetailsBase,
    Icon,
    Json,
    CodeBlock,
  },
  props: {
    /**
     * Details section title
     */
    title: {
      type: String,
      default: 'Addons',
    },
    /**
     * Object with key-values to display
     */
    addons: {
      type: Object,
      required: true,
    },
  },
  methods: {
    /**
     * Check if this key has custom rendering method,
     * for example { window: {innerWidth: 1344, innerHeight: 763} } will be rendered as 1344x763
     *
     * @param key - addons keys to check
     */
    isCustomRenderer(key: string): boolean {
      return [ 'window' ].includes(key);
    },

    /**
     * Render value in correct format
     *
     * @param {string | object} key - addons key
     * @param {*} value - addons value
     * @returns {string}
     */
    renderAddonValue(key: string | object, value: any): string {
      if (key === 'window') {
        return value.innerWidth + 'x' + value.innerHeight;
      }

      return value;
    },

    /**
     * Check if passed variable is an Object
     *
     * @param value - what to check
     * @returns {boolean} true if it is an object
     */
    isObject(value: any): boolean {
      return isObject(value);
    },

    /**
     * Check is this addon field should be highlighted as HTML
     * For example, this is a Vue or React component name
     *
     * @param key - addon key
     */
    isHTML(key: string): boolean {
      return key === 'component' && this.title === 'Vue';
    },
  },
});
</script>

<style>
  .event-details {
    &__single-line-code {
      line-height: 1em;
      background: var(--color-bg-code-fragment);
      border: 0
    }
  }
</style>
