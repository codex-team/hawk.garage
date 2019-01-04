import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: () => import(/* webpackChunkName: "sign-up" */ './views/SignUp.vue')
    },
    {
      path: '/docs',
      name: 'docs',
      // route level code-splitting
      // this generates a separate chunk (docs.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "docs" */ './views/Docs.vue')
    }
  ]
})
