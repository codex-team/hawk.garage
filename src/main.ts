import './styles/base.css';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import ConfirmationWindow from './plugins/ConfirmationWindow';
import NotifierWindow from './plugins/NotifierWindow';
import Popover from './plugins/Popover';
import App from './App.vue';
import router from './router';
import store from './store';
import './filters';
import './directives';
import i18n from './i18n';
import * as api from './api/index';
import { REFRESH_TOKENS } from './store/modules/user/actionTypes';
import { RESET_STORE } from './store/methodsTypes';
import UniqueId from 'vue-unique-id';

/**
 * Integrations
 */
import { Analytics } from './analytics';
import { useErrorTracker, ErrorTrackerInitialOptions } from './hawk';

const { init: initHawk, track } = useErrorTracker();

/**
 * Enable errors tracking via Hawk.so
 */
if (process.env.VUE_APP_HAWK_TOKEN) {
  const options: ErrorTrackerInitialOptions = {
    vue: Vue,
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
 *
 * @param {Error} error - error to send
 * @example this.$sendToHawk(new Error('Some error'));
 */
Vue.prototype.$sendToHawk = function sendToHawk(error: Error): void {
  track(error);
};

/**
 * Enable analytics via Amplitude.com
 */
if (process.env.VUE_APP_AMPLITUDE_TOKEN) {
  Analytics.init(process.env.VUE_APP_AMPLITUDE_TOKEN);
}

/**
 * Vue wrapper for sending analytics events
 */
Vue.prototype.$sendToAmplitude = Analytics.track;

Vue.config.devtools = process.env.NODE_ENV !== 'production';

Vue.prototype.$API_AUTH_GOOGLE = process.env.VUE_APP_API_AUTH_GOOGLE || 'http://localhost:3000/auth/google';
Vue.prototype.$API_AUTH_GITHUB = process.env.VUE_APP_API_AUTH_GITHUB || 'http://localhost:3000/auth/github';

Vue.use(VueCookies);
Vue.use(UniqueId);
Vue.use(ConfirmationWindow);
Vue.use(NotifierWindow);
Vue.use(Popover);

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
    return (await store.dispatch(REFRESH_TOKENS)).accessToken;
  },

  /**
   * If user refresh token is invalid then log out user
   */
  onAuthError() {
    store.dispatch(RESET_STORE);
  },
});

new Vue({
  router,
  store,
  i18n,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  render: (h) => h(App),
}).$mount('#app');
