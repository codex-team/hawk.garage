import Vue from 'vue';
import {isObject} from '../utils';

/**
 * Useful methods for rendering event addons
 */
export default Vue.extend( {
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
     * Uppercase the first letter
     *
     * @param string - string to process
     */
    capitalize(string: string): string {
      return string.charAt(0).toUpperCase() + string.slice(1);
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
  }
});
