import { VueConstructor } from 'vue';
import Popover from '@/components/utils/Popover/Popover.vue';
import i18n from '../i18n';

/**
 * Type of popover component
 */
type PopoverComponentType = InstanceType<typeof Popover>;

/**
 * Plugin for using popover in components
 *
 * @example this.$popover.open({
 * component: <any component>,
 * componentProps: <pass props>,
 *  popoverPros:{
 *    top: '20%',
 *    left: '40%',
 *  }
 * });
 */
export default {
  /**
   * Install Vue plugin
   *
   * @param Vue - vue constructor
   */
  install: (Vue: VueConstructor): void => {
    const vueContainer = document.createElement('div');
    const notifierContainer = new Vue<PopoverComponentType>({
      i18n,
      render: (h) => h(Popover),
    });

    document.body.appendChild(vueContainer);
    notifierContainer.$mount(vueContainer);

    Vue.prototype.$popover = {
      /**
       * Open popover
       *
       * @param options - popover options
       */
      open(options?) {
        (notifierContainer.$children[0] as PopoverComponentType).open(
          options
        );
      },

      /**
       * Close notifier window
       */
      close() {
        (notifierContainer.$children[0] as PopoverComponentType).close();
      },
    };
  },
};
