import { ConfirmationWindowOptions } from '../components/utils/ConfirmationWindow/types';

declare module 'vue/types/vue' {
  interface Vue {
    $confirm: {
      open: (options?: ConfirmationWindowOptions) => void;
      close: () => void;
    };
  }
}
