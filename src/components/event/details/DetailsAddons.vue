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

/**
 * Details addons component
 */
export default Vue.extend({
  name: 'DetailsAddons',
  components: {
    DetailsBase,
    Icon,
    Json,
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
     * @param key - addons keys to check
     */
    isCustomRenderer(key: string): boolean {
      return [ 'window' ].includes(key);
    },

    /**
     * Render value in correct format
     * @param {string | object} key - addons key
     * @param {*} value - addons value
     * @return {String}
     */
    renderAddonValue(key: string | object, value: any): string {
      if (key === 'window') {
        return value.innerWidth + 'x' + value.innerHeight;
      }

      return value;
    },

    /**
     * Check if passed variable is an Object
     * @param value - what to check
     * @return true if it is an object
     */
    isObject(value: any): boolean {
      return isObject(value);
    },
  },
});
</script>
