import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueAxios, axios);

Vue.config.devtools = process.env.NODE_ENV !== 'production';
Vue.config.debug = process.env.NODE_ENV !== 'production';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
