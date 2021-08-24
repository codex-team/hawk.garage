import { VueConstructor } from 'vue';
import NotifierWindow from '@/components/utils/NotifierWindow/NotifierWindow.vue';
import { NotifierWindowOptions } from '../components/utils/NotifierWindow/types';
import i18n from '../i18n';

/**
 * Type of notifier window component
 */
type NotifierWindowComponentType = InstanceType<typeof NotifierWindow>;

/**
 * Plugin for using notifier window in components
 *
 * @example this.$notify.open({ description: 'Hi! Hawk' });
 */
export default {
  /**
   * Install Vue plugin
   *
   * @param Vue - vue constructor
   */
  install: (Vue: VueConstructor): void => {
    const vueContainer = document.createElement('div');
    const notifierContainer = new Vue<NotifierWindowComponentType>({
      i18n,
      render: h => h(NotifierWindow),
    });

    document.body.appendChild(vueContainer);
    notifierContainer.$mount(vueContainer);

    Vue.prototype.$notify = {
      /**
       * Open notifier window
       *
       * @param options - notifier window options
       */
      open(options?: NotifierWindowOptions) {
        (notifierContainer.$children[0] as NotifierWindowComponentType).open(
          options
        );
      },

      /**
       * Close notifier window
       */
      close() {
        (notifierContainer.$children[0] as NotifierWindowComponentType).close();
      },
    };
  },
};
