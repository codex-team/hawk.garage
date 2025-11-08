import type { VueConstructor } from 'vue';
import ConfirmationWindow from '@/components/utils/ConfirmationWindow/ConfirmationWindow.vue';
import type { ConfirmationWindowOptions } from '../components/utils/ConfirmationWindow/types';
import i18n from '../i18n';

/**
 * Type of confirmation window component
 */
type ConfirmationWindowComponentType = InstanceType<typeof ConfirmationWindow>;

/**
 * Plugin for using confirmation window in components
 * @example this.$confirm.open({ title: 'Confirmation window title' });
 */
export default {
  /**
   * Install Vue plugin
   * @param Vue - vue constructor
   */
  install: (Vue: VueConstructor): void => {
    const vueContainer = document.createElement('div');
    const confirmationContainer = new Vue({
      i18n,
      render: h => h(ConfirmationWindow),
    });

    document.body.appendChild(vueContainer);
    confirmationContainer.$mount(vueContainer);

    const getConfirmationInstance = (): ConfirmationWindowComponentType => {
      const [instance] = confirmationContainer.$children;

      if (!instance) {
        throw new Error('ConfirmationWindow instance is not mounted');
      }

      return instance as ConfirmationWindowComponentType;
    };

    Vue.prototype.$confirm = {
      /**
       * Open confirmation window
       * @param options - confirmation window options
       */
      open(options?: ConfirmationWindowOptions) {
        getConfirmationInstance().open(options);
      },

      /**
       * Close confirmation window
       */
      close() {
        getConfirmationInstance().close();
      },
    };
  },
};
