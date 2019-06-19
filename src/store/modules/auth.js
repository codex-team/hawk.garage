/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_LOGOUT, SIGN_UP_REQUEST } from '../actions/auth';
import router from '../../router';
import * as authApi from '../../api/auth';
import * as api from '../../api';

/**
 * @typedef {object} User - represents user
 * @property {string} email - user's email
 * @property {string} password - user's password
 */

/**
 * Module state
 * @typedef {object} AuthModuleState
 * @property {string} accessToken - user's access token
 * @property {string} refreshToken - user's refresh token for getting new tokens pair
 */
const state = {
  accessToken: '',
  refreshToken: ''
};

const actions = {
  /**
   * Send sign up request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   */
  async [SIGN_UP_REQUEST]({ commit }, user) {
    const tokens = await authApi.signUp(user.email);

    commit(AUTH_SUCCESS, tokens);
  },

  /**
   * Send login request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   */
  async [AUTH_REQUEST]({ commit }, user) {
    const tokens = await authApi.login(user.email, user.password);

    commit(AUTH_SUCCESS, tokens);
  }
};

const mutations = {
  /**
   * Mutation caused by successful authentication
   * @param {AuthModuleState} state - Vuex state
   * @param {string} accessToken - user's access token
   * @param {string} refreshToken - user's refresh token for getting new tokens pair
   */
  [AUTH_SUCCESS](state, { accessToken, refreshToken }) {
    api.setAuthToken(accessToken);
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
  },

  /**
   * Mutation caused when user logout
   * @param {AuthModuleState} state - Vuex state
   */
  [AUTH_LOGOUT](state) {
    router.push('/login');
    api.setAuthToken(null);
    state.accessToken = '';
    state.refreshToken = '';
  }
};

export default {
  state,
  actions,
  mutations
};
