/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { LOGIN, SET_TOKENS, REMOVE_TOKENS, SIGN_UP, REFRESH_TOKENS } from '../actions/auth';
import router from '../../router';
import * as authApi from '../../api/auth';

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

const getters = {
  /**
   * Returns true if the user is authenticated else false
   * @param {AuthModuleState} state - vuex state
   * @return {boolean}
   */
  isAuthenticated: state => !!state.accessToken
};

const actions = {
  /**
   * Send sign up request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   */
  async [SIGN_UP]({ commit }, user) {
    const tokens = await authApi.signUp(user.email);

    commit(SET_TOKENS, tokens);
  },

  /**
   * Send login request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   */
  async [LOGIN]({ commit }, user) {
    const tokens = await authApi.login(user.email, user.password);

    commit(SET_TOKENS, tokens);
  },

  /**
   * Send request for refreshing tokens pair
   * @param {function} commit - standard Vuex commit function
   * @param {AuthModuleState} state - vuex state
   * @return {Promise<TokensPair>}
   */
  async [REFRESH_TOKENS]({ commit, state }) {
    const tokens = await authApi.refreshTokens(state.refreshToken);

    commit(SET_TOKENS, tokens);

    return tokens;
  }
};

const mutations = {
  /**
   * Mutation caused by successful authentication
   * @param {AuthModuleState} state - Vuex state
   * @param {string} accessToken - user's access token
   * @param {string} refreshToken - user's refresh token for getting new tokens pair
   */
  [SET_TOKENS](state, { accessToken, refreshToken }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
  },

  /**
   * Mutation caused when user logout
   * @param {AuthModuleState} state - Vuex state
   */
  [REMOVE_TOKENS](state) {
    router.push('/login');
    state.accessToken = '';
    state.refreshToken = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
