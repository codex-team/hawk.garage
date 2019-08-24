import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './filters';
import './directives';
import './registerServiceWorker';

Vue.config.devtools = process.env.NODE_ENV !== 'production';
Vue.config.debug = process.env.NODE_ENV !== 'production';

Vue.prototype.$API_AUTH_GOOGLE = process.env.VUE_APP_API_AUTH_GOOGLE;
Vue.prototype.$API_AUTH_GITHUB = process.env.VUE_APP_API_AUTH_GITHUB;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
