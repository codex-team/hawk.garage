import { VueConstructor } from 'vue';
import ConfirmationWindow from '@/components/utils/ConfirmationWindow/ConfirmationWindow.vue';
import ConfirmationWindowOptions from '@/components/utils/ConfirmationWindow/ConfirmationWindowsOptions';

/**
 * Type of confirmation window component
 */
type ConfirmationWindowComponentType = InstanceType<typeof ConfirmationWindow>;

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
    const confirmationContainer = new Vue<ConfirmationWindowComponentType>({
      render: h => h(ConfirmationWindow),
    });

    document.body.appendChild(vueContainer);
    confirmationContainer.$mount(vueContainer);

    Vue.prototype.$confirm = {
      /**
       * Open confirmation window
       *
       * @param options - confirmation window options
       */
      open(options?: ConfirmationWindowOptions) {
        (confirmationContainer.$children[0] as ConfirmationWindowComponentType).open(options);
      },

      /**
       * Close confirmation window
       */
      close() {
        (confirmationContainer.$children[0] as ConfirmationWindowComponentType).close();
      },
    };
  },
};
