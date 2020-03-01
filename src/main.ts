import Vue from 'vue';
import VueCookies from 'vue-cookies';
import App from './App.vue';
import router from './router';
import store from './store';
import './filters';
import './directives';
import './registerServiceWorker';
import i18n from './i18n';
import * as api from './api/index';
import { REFRESH_TOKENS } from './store/modules/user/actionTypes';
import { RESET_STORE } from './store/methodsTypes';
import HawkCatcher from '@hawk.so/javascript';
import { HawkInitialSettings, HawkUser } from '@hawk.so/javascript/types/hawk-initial-settings';

/**
 * Current build revision
 * passed from Webpack Define Plugin
 */
declare const buildRevision: string;

/**
 * Enable frontend-errors tracking
 */
if (process.env.VUE_APP_HAWK_TOKEN) {
  const hawkOptions: HawkInitialSettings = {
    token: process.env.VUE_APP_HAWK_TOKEN,
    release: buildRevision,
  };

  if (store.state.user) {
    hawkOptions.user = {
      id: store.state.user.data.id,
      name: store.state.user.data.name || store.state.user.data.email,
      image: store.state.user.data.image,
      url: '',
    } as HawkUser;
  }

  new HawkCatcher(hawkOptions);
}

Vue.config.devtools = process.env.NODE_ENV !== 'production';

Vue.prototype.$API_AUTH_GOOGLE = process.env.VUE_APP_API_AUTH_GOOGLE || 'http://localhost:3000/auth/google';
Vue.prototype.$API_AUTH_GITHUB = process.env.VUE_APP_API_AUTH_GITHUB || 'http://localhost:3000/auth/github';

Vue.use(VueCookies);

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
  render: (h) => h(App),
}).$mount('#app');
