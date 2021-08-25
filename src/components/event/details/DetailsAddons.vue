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
        v-for="([key, value]) in addonsDisplayed"
        :key="key"
        class="event-details__content-block"
      >
        <div class="event-details__key">
          {{ getAddonName(key) }}
        </div>
        <div class="event-details__value">
          <component
            :is="customRendererNamePrefix + capitalize(key)"
            v-if="isCustomRenderer(key)"
            :value="value"
          />
          <template v-else>
            <!-- JSON value -->
            <Json
              v-if="isObject(value)"
              :value="value"
            />

            <!-- HTML value -->
            <CodeBlock
              v-else-if="isHTML(key)"
              language="html"
              class="event-details__single-line-code"
            >
              {{ value }}
            </CodeBlock>

            <!-- String value -->
            <template v-else>
              {{ value }}
            </template>
          </template>
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import DetailsBase from './DetailsBase.vue';
import Icon from '../../utils/Icon.vue';
import { isObject } from '@/utils';
import Json from '../../utils/Json.vue';
import CodeBlock from '../../utils/CodeBlock.vue';
import CustomRendererBeautifiedUserAgent from '@/components/event/details/customRenderers/BeautifiedUserAgent.vue';
import CustomRendererWindow from '@/components/event/details/customRenderers/Window.vue';
import { EventAddons } from 'hawk.types';
import { Entries } from '../../../types/utils';

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
    CustomRendererBeautifiedUserAgent,
    CustomRendererWindow,
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
      type: Object as PropType<EventAddons>,
      required: true,
    },
  },
  data(): {
    customRendererNamePrefix: string
    } {
    return {
      /**
       * Custom render components should have the "CustomRenderer" prefix
       */
      customRendererNamePrefix: 'CustomRenderer',
    };
  },
  computed: {
    /**
     * Returns addons list to display
     * Some addons have their beautified versions added on backend processing
     *   — if so, show them instead of originals
     *
     * @see https://github.com/codex-team/hawk.garage/issues/436
     */
    addonsDisplayed(): Entries<EventAddons> {
      const addonsBeautified = {
        userAgent: 'beautifiedUserAgent',
      };

      return Object.entries(this.addons).filter(([name, _value]) => {
        return addonsBeautified[name] === undefined;
      }) as Entries<EventAddons>;
    },
  },
  methods: {
    /**
     * Some addons can have custom renderer moved to separate component.
     *
     * How to add a custom renderer:
     *  1. Create a Component in './custom-renderers/' dir. Name it as addon named.
     *  2. Import this component to this file. Give it a name with the 'CustomRenderer' prefix.
     *
     *     @example import CustomRendererWindow from './custom-renderers/Window.vue';
     *  3. Connect it to the 'components' section
     *
     *
     * @param key - addons keys to check
     */
    isCustomRenderer(key: string): boolean {
      const customRenderers = Object.keys(this.$options.components as any)
        .filter(name => name.startsWith(this.customRendererNamePrefix))
        .map(name => name.replace(this.customRendererNamePrefix, ''));

      return this.capitalize(key).match(new RegExp(customRenderers.join('|'), 'i')) !== null;
    },

    /**
     * Return addon name in human-readable form
     *
     * @param name - addon original key
     */
    getAddonName(name: string): string {
      const dictKey = `event.addons.${name}`;

      /**
       * Check for translation existence
       */
      if (this.$i18n.te(dictKey)) {
        return this.$i18n.t(dictKey) as string;
      }

      return name;
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

    /**
     * Uppercase the first letter
     *
     * @param string - string to process
     */
    capitalize(string: string): string {
      return string.charAt(0).toUpperCase() + string.slice(1);
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
