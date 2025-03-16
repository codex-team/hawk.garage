<template>
  <DetailsBase>
    <template #header>
      <template v-if="icon">
        <Icon :symbol="icon" />
      </template>
      {{ title }}
    </template>
    <template #content>
      <div
        v-for="([key, value]) in Object.entries(addons)"
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
              {{ value || '—' }}
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
import Json from '../../utils/Json.vue';
import CodeBlock from '../../utils/CodeBlock.vue';
import CustomRendererBeautifiedUserAgent from '@/components/event/details/customRenderers/BeautifiedUserAgent.vue';
import CustomRendererWindow from '@/components/event/details/customRenderers/Window.vue';
import { EventAddons } from '@hawk.so/types';
import AddonRenderers from '../../../mixins/addonRenderers';

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
  mixins: [
    AddonRenderers,
  ],
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

    /**
     * Integration framework logo
     */
    icon: {
      type: String,
      default: '',
    },
  },
  computed: {
  },
  methods: {
    /**
     * Check is this addon field should be highlighted as HTML
     * For example, this is a Vue or React component name
     *
     * @param key - addon key
     */
    isHTML(key: string): boolean {
      return key.toLowerCase() === 'component' && ['Vue', 'Nuxt'].includes(this.title);
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
