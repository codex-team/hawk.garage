import { ConfirmationWindowOptions } from '../components/utils/ConfirmationWindow/types';

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
    $notifyNewVersion: {
      /**
       * Open confirmation window
       *
       * @param options - confirmation window options
       */
      open: () => void;

      /**
       * Close confirmation window
       */
      close: () => void;
    };
  }
}
