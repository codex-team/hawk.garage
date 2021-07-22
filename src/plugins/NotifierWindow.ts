import { VueConstructor } from 'vue';
import NotifierWindow from '@/components/utils/NotifierWindow/NotifierWindow.vue';
import { NotifierWindowOptions } from '../components/utils/NotifierWindow/types';
import i18n from '../i18n';

/**
 * Type of confirmation window component
 */
type NotifierWindowComponentType = InstanceType<typeof NotifierWindow>;

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
    const confirmationContainer = new Vue<NotifierWindowComponentType>({
      i18n,
      render: h => h(NotifierWindow),
    });

    document.body.appendChild(vueContainer);
    confirmationContainer.$mount(vueContainer);

    Vue.prototype.$confirm = {
      /**
       * Open confirmation window
       *
       * @param options - confirmation window options
       */
      open(options?: NotifierWindowOptions) {
        (confirmationContainer.$children[0] as NotifierWindowComponentType).open(options);
      },

      /**
       * Close confirmation window
       */
      close() {
        (confirmationContainer.$children[0] as NotifierWindowComponentType).close();
      },
    };
  },
};
