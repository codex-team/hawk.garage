import { App, createApp, ComponentPublicInstance } from 'vue';
import Popover from '@/components/utils/Popover/Popover.vue';
import { i18n } from '../i18n';
import Router from '../router';

/**
 * Type of popover component
 */
type PopoverComponentType = ComponentPublicInstance<typeof Popover>;

/**
 * Plugin for using popover in components
 *
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
   *
   * @param app - Vue 3 app instance
   */
  install: (app: App): void => {
    const vueContainer = document.createElement('div');
    const popoverApp = createApp(Popover);
    
    // Подключаем i18n и router к приложению popover
    popoverApp.use(i18n);
    popoverApp.use(Router);

    document.body.appendChild(vueContainer);
    const popoverInstance = popoverApp.mount(vueContainer) as PopoverComponentType;

    // Добавляем глобальное свойство для доступа к popover
    app.config.globalProperties.$popover = {
      /**
       * Open popover
       *
       * @param options - popover options
       */
      open(options?) {
        popoverInstance.open(options);
      },

      /**
       * Close popover
       */
      close() {
        popoverInstance.close();
      },
    };
  },
};
