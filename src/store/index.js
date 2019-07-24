import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import auth from './modules/auth';
import workspaces from './modules/workspaces';
import projects from './modules/projects';

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    app,
    auth,
    workspaces,
    projects
  },
  plugins: [ createPersistedState() ],
  strict: debug
});
