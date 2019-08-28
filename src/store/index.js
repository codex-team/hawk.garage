import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import workspaces from './modules/workspaces';
import projects from './modules/projects';
import notify from './modules/notify';

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    app,
    user,
    workspaces,
    projects,
    notify
  },
  plugins: [createPersistedState(), store => {
    store.subscribe((mutation, state) => {
      console.log(`Invoking ${mutation.type}: ${JSON.stringify(mutation.payload, null, 2)} on ${JSON.stringify(state, null, 2)}`);
    });
  }],
  strict: debug
});
