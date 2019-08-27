import Vue from 'vue';
import VueCookies from 'vue-cookies';

import App from './App.vue';
import router from './router';
import store from './store';
import './filters';
import './directives';
import './registerServiceWorker';
import i18n from './i18n';
import * as api from './api';
import { REFRESH_TOKENS } from './store/modules/user/actionTypes';
import { RESET_STORE } from './store/methodsTypes';

Vue.config.devtools = process.env.NODE_ENV !== 'production';
Vue.config.debug = process.env.NODE_ENV !== 'production';

Vue.prototype.$API_AUTH_GOOGLE = process.env.VUE_APP_API_AUTH_GOOGLE || 'http://localhost:3000/auth/google';
Vue.prototype.$API_AUTH_GITHUB = process.env.VUE_APP_API_AUTH_GITHUB || 'http://localhost:3000/auth/github';

Vue.use(VueCookies);

/**
 * Configure API
 */
api.setAuthToken(store.state.user.accessToken);
api.eventsHandlers.onTokenExpired = async () => (await store.dispatch(REFRESH_TOKENS)).accessToken;
api.eventsHandlers.onAuthError = () => store.dispatch(RESET_STORE);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
