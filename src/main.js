import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './styles/variables.css';

Vue.config.devtools = process.env.NODE_ENV !== 'production';
Vue.config.debug = process.env.NODE_ENV !== 'production';

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
