import { VueConstructor } from 'vue';
import NewVersionWindow from '@/components/utils/NewVersionWindow.vue';
import i18n from '../i18n';

/**
 * Type of confirmation window component
 */
type NewVersionWindowComponentType = InstanceType<typeof NewVersionWindow>;

/**
 * Plugin for using confirmation window in components
 *
 * @example this.$confirm.open({ title: 'Confirmation window title' });
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
       * Open confirmation window
       *
       * @param options - confirmation window options
       */
      open() {
        (confirmationContainer.$children[0] as NewVersionWindowComponentType).open();
      },

      /**
       * Close confirmation window
       */
      close() {
        (confirmationContainer.$children[0] as NewVersionWindowComponentType).close();
      },
    };
  },
};
