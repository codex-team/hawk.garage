import type { ConfirmationWindowOptions } from '../components/utils/ConfirmationWindow/types';
import type { NotifierWindowOptions } from '../components/utils/NotifierWindow/types';

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Plugin for working with confirmation window
     * You can open or close confirmation window with it
     */
    $confirm: {
      /**
       * Open confirmation window
       * @param options - confirmation window options
       */
      open: (options?: ConfirmationWindowOptions) => void;

      /**
       * Close confirmation window
       */
      close: () => void;
    };
    $notify: {
      /**
       * Open notifier window
       * @param options - notifier window options
       */
      open: (options?: NotifierWindowOptions) => void;

      /**
       * Close notifier window
       */
      close: () => void;
    };
    $popover: {
      /**
       * Open popover
       * @param options - popover options
       */
      open: (options?) => void;

      /**
       * Close popover
       */
      close: () => void;
    };
  }
}
