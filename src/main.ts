import './styles/base.css';
import { createApp } from 'vue';
import 'virtual:svg-icons-register';
import ConfirmationWindow from './plugins/ConfirmationWindow';
import Popover from './plugins/Popover';
import App from './App.vue';
import router from './router';
import store from './store';
import { i18n } from './i18n';
import * as api from './api/index';
import { REFRESH_TOKENS } from './store/modules/user/actionTypes';
import { RESET_STORE } from './store/methodsTypes';

import '@codexteam/ui/styles';

const DEBOUNCE_TIMEOUT = 1000;

/**
 * Integrations
 */
import { Analytics } from './analytics';
import type { ErrorTrackerInitialOptions } from './hawk';
import { useErrorTracker } from './hawk';
import notifier from 'codex-notifier';
import { errorMessages } from './api/const';
import { debounce } from './utils';
import setupDirectives from './directives';

const { init: initHawk, track } = useErrorTracker();

const app = createApp(App);

app.use(router);
app.use(store);
app.use(i18n);
app.mount('#app');

/**
 * Enable errors tracking via Hawk.so
 */
if (import.meta.env.VITE_HAWK_TOKEN) {
  const options: ErrorTrackerInitialOptions = {
    vue: app,
  };

  if (store.state.user && store.state.user.data && Object.keys(store.state.user.data).length) {
    options.user = {
      id: store.state.user.data.id,
      name: store.state.user.data.name || store.state.user.data.email,
      image: store.state.user.data.image,
      url: '',
    };
  }

  initHawk(options);
}

/**
 * Sends error to the Hawk
 * @param error - error to send
 * @example this.$sendToHawk(new Error('Some error'));
 */
app.config.globalProperties.$sendToHawk = function sendToHawk(error: Error): void {
  track(error);
};

/**
 * Enable analytics via Amplitude.com
 */
if (import.meta.env.VITE_AMPLITUDE_TOKEN) {
  void Analytics.init(import.meta.env.VITE_AMPLITUDE_TOKEN);
}

setupDirectives(app);

/**
 * Vue wrapper for sending analytics events
 */
app.config.globalProperties.$sendToAmplitude = Analytics.track;

app.config.globalProperties.$API_AUTH_GOOGLE = import.meta.env.VITE_API_AUTH_GOOGLE || 'http://localhost:3000/auth/google';
app.config.globalProperties.$API_AUTH_GITHUB = import.meta.env.VITE_API_AUTH_GITHUB || 'http://localhost:3000/auth/github';

app.use(ConfirmationWindow);
app.use(Popover);

/**
 * Configure API
 */
api.setAuthToken(store.state.user.accessToken);
api.setupApiModuleHandlers({
  /**
   * Call Vuex action for refreshing tokens.
   * Action will update access token in store and return it
   */
  async onTokenExpired() {
    const tokens = await store.dispatch(REFRESH_TOKENS);

    // New tokens might be missing is case of expired refresh token
    if (!tokens) {
      return null;
    }

    return tokens.accessToken;
  },

  /**
   * If user refresh token is invalid then log out user
   */
  onAuthError: debounce(() => {
    void store.dispatch(RESET_STORE);

    const key = 'errors.' + errorMessages.UNAUTHENTICATED;

    notifier.show({
      message: i18n.global.t(key),
      style: 'error',
      time: 5000,
    });
  }, DEBOUNCE_TIMEOUT),
});