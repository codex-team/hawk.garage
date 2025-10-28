import { App, createApp, ComponentPublicInstance } from 'vue';
import ConfirmationWindow from '@/components/utils/ConfirmationWindow/ConfirmationWindow.vue';
import { ConfirmationWindowOptions } from '../components/utils/ConfirmationWindow/types';
import { i18n } from '../i18n';
import Router from '../router';

/**
 * Type of confirmation window component
 */
type ConfirmationWindowComponentType = ComponentPublicInstance<typeof ConfirmationWindow>;

/**
 * Plugin for using confirmation window in components
 *
 * @example this.$confirm.open({ title: 'Confirmation window title' });
 */
export default {
  /**
   * Install Vue plugin
   *
   * @param app - Vue 3 app instance
   */
  install: (app: App): void => {
    const vueContainer = document.createElement('div');
    const confirmationApp = createApp(ConfirmationWindow);
    
    // Подключаем i18n и router к приложению confirmation window
    confirmationApp.use(i18n);
    confirmationApp.use(Router);

    document.body.appendChild(vueContainer);
    const confirmationInstance = confirmationApp.mount(vueContainer) as ConfirmationWindowComponentType;

    // Добавляем глобальное свойство для доступа к confirmation window
    app.config.globalProperties.$confirm = {
      /**
       * Open confirmation window
       *
       * @param options - confirmation window options
       */
      open(options?: ConfirmationWindowOptions) {
        confirmationInstance.open(options);
      },

      /**
       * Close confirmation window
       */
      close() {
        confirmationInstance.close();
      },
    };
  },
};
