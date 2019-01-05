import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue')
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import(/* webpackChunkName: "sign-up" */ './views/SignUp.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import(/* webpackChunkName: "docs" */ './views/Docs.vue')
    },
    {
      path: '/garage',
      name: 'garage',
      component: () => import(/* webpackChunkName: "garage" */ './views/Garage.vue')
    }
  ]
});
