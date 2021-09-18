import { VueConstructor } from "vue";
import Popover from "@/components/utils/Popover/Popover.vue";
import i18n from "../i18n";

/**
 * Type of notifier window component
 */
type PopoverComponentType = InstanceType<typeof Popover>;

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
    const vueContainer = document.createElement("div");
    const notifierContainer = new Vue<PopoverComponentType>({
      i18n,
      render: (h) => h(Popover),
    });

    document.body.appendChild(vueContainer);
    notifierContainer.$mount(vueContainer);

    Vue.prototype.$popover = {
      /**
       * Open notifier window
       *
       * @param options - notifier window options
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
