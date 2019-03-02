import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/garage',
  routes: [
    {
      path: '/',
      meta: {
        title: 'Garage - Hawk.so'
      },
      name: 'home',
      component: Home
    },
    {
      path: '/settings',
      meta: {
        title: 'Settings - Hawk.so'
      },
      name: 'settings',
      component: Settings
    }
  ]
});
