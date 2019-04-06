/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import auth from '../modules/auth';

const state = {
  user: ''
};

const getters = {};

const actions = {
  login({ commit, state }, { email, password }) {},
  logout({ commit }) {},
  signUp({ commit, state }, { email }) {}
};

const mutations = {
  setUser(state, username) {}
};

export default {
  state,
  getters,
  actions,
  mutations
};
