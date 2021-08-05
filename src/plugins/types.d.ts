import { ConfirmationWindowOptions } from '../components/utils/ConfirmationWindow/types';
import { NotifierWindowOptions } from '../components/utils/NotifierWindow/types';

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Plugin for working with confirmation window
     * You can open or close confirmation window with it
     */
    $confirm: {
      /**
       * Open confirmation window
       *
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
       *
       * @param options - notifier window options
       */
      open: (options?: NotifierWindowOptions) => void;

      /**
       * Close notifier window
       */
      close: () => void;
    };
  }
}
