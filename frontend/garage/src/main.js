import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueAxios, axios);
axios.defaults.baseURL = process.env.SERVER_URL || 'http://localhost:3000';

Vue.config.devtools = true;
Vue.config.debug = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
