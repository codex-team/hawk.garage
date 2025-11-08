import type { VueConstructor } from 'vue';
import Popover from '@/components/utils/Popover/Popover.vue';
import i18n from '../i18n';
import Router from '../router';

/**
 * Type of popover component
 */
type PopoverComponentType = InstanceType<typeof Popover>;

/**
 * Plugin for using popover in components
 * @example this.$popover.open({
 * component: <any component>,
 * componentProps: <pass props>,
 *  popoverPros:{
 *    showBelowElement: SomeElement,
 *  }
 * });
 */
export default {
  /**
   * Install Vue plugin
   * @param Vue - vue constructor
   */
  install: (Vue: VueConstructor): void => {
    const vueContainer = document.createElement('div');
    const notifierContainer = new Vue({
      i18n,
      router: Router,
      render: h => h(Popover),
    });

    document.body.appendChild(vueContainer);
    notifierContainer.$mount(vueContainer);

    const getPopoverInstance = (): PopoverComponentType => {
      const [instance] = notifierContainer.$children;

      if (!instance) {
        throw new Error('Popover instance is not mounted');
      }

      return instance as PopoverComponentType;
    };

    Vue.prototype.$popover = {
      /**
       * Open popover
       * @param options - popover options
       */
      open(options?) {
        getPopoverInstance().open(options);
      },

      /**
       * Close notifier window
       */
      close() {
        getPopoverInstance().close();
      },
    };
  },
};
