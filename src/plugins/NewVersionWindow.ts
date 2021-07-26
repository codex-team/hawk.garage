import { VueConstructor } from 'vue';
import NewVersionWindow from '@/components/utils/NewVersionWindow.vue';
import i18n from '../i18n';

/**
 * Type of new version window component
 */
type NewVersionWindowComponentType = InstanceType<typeof NewVersionWindow>;

/**
 * Plugin for using new version window in components
 *
 * @example this.$notifyNewVersion.open();
 */
export default {
  /**
   * Install Vue plugin
   *
   * @param Vue - vue constructor
   */
  install: (Vue: VueConstructor) => {
    const vueContainer = document.createElement('div');
    const confirmationContainer = new Vue<NewVersionWindowComponentType>({
      i18n,
      render: h => h(NewVersionWindow),
    });

    document.body.appendChild(vueContainer);
    confirmationContainer.$mount(vueContainer);

    Vue.prototype.$notifyNewVersion = {
      /**
       * Open new version window
       *
       * @param options - new version window options
       */
      open() {
        (confirmationContainer.$children[0] as NewVersionWindowComponentType).open();
      },

      /**
       * Close new version window
       */
      close() {
        (confirmationContainer.$children[0] as NewVersionWindowComponentType).close();
      },
    };
  },
};
