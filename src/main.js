import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import api from '@/services/Api.js';

Vue.use(VueAxios, axios);

Vue.$api = api;

Object.defineProperty(Vue.prototype, '$api', {
  get() {
    return api;
  }
});

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = process.env.SERVER_URL || 'http://localhost:3000';
}

Vue.config.devtools = process.env.NODE_ENV !== 'production';
Vue.config.debug = process.env.NODE_ENV !== 'production';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
