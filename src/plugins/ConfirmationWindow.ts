import { VueConstructor } from 'vue';
import ConfirmationWindow from '@/components/utils/ConfirmationWindow/ConfirmationWindow.vue';
import ConfirmationWindowOptions from '@/components/utils/ConfirmationWindow/ConfirmationWindowsOptions';

export default {
  install: (Vue: VueConstructor) => {
    const vueContainer = document.createElement('div');
    const confirmationContainer = new Vue({
      render: h => h(ConfirmationWindow),
    });

    document.body.appendChild(vueContainer);
    confirmationContainer.$mount(vueContainer);

    Vue.prototype.$confirm = {
      open(options?: ConfirmationWindowOptions) {
        confirmationContainer.$children[0].open(options);
      },
      close() {
        confirmationContainer.$children[0].close();
      },
    };
  },
};
