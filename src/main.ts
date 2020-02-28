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

console.log('process.env.VUE_APP_HAWK_TOKEN', process.env.VUE_APP_HAWK_TOKEN);
console.log('store.state.user', store.state.user);

if (process.env.VUE_APP_HAWK_TOKEN) {
  const hawk = new HawkCatcher({
    token: process.env.VUE_APP_HAWK_TOKEN,
  });

  hawk.test();
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
