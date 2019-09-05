/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import Vue from 'vue';
import {
  LOGIN,
  SIGN_UP,
  SET_TOKENS,
  REFRESH_TOKENS,
  FETCH_CURRENT_USER,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  RESET_GITHUB,
  RESET_GOOGLE
} from './actionTypes';
import { RESET_STORE } from '../../methodsTypes';
import * as authApi from '../../../api/user';

/**
 * Mutations enum for this module
 */
const mutationTypes = {
  SET_TOKENS: 'SET_TOKENS', // Sets user's auth tokens (for example, after authentication or updating tokens)
  SET_CURRENT_USER: 'SET_CURRENT_USER', // Sets user's field
  RESET_GITHUB: 'RESET_GITHUB',
  RESET_GOOGLE: 'RESET_GOOGLE'
};

/**
 * @typedef {object} User - represents user
 * @property {string} id - user's id
 * @property {string} email - user's email
 * @property {string} name - user's name
 * @property {string} password - user's password
 * @property {object} [github] - github authn data
 * @property {number} [github.id] - github id
 * @property {string} [github.login] - github login
 * @property {string} [github.email] - github email
 * @property {string} [github.name] - github name
 * @property {object} [google] - google authn data
 * @property {number} [google.id] - google id
 * @property {string} [google.login] - google login
 * @property {string} [google.email] - google email
 * @property {string} [google.name] - google name
 */

/**
 * @typedef {object} Passwords - represents password pair
 * @property {string} old - user's old password
 * @property {string} new - user's new password
 */

/**
 * Module state
 *
 * @typedef {object} AuthModuleState
 * @property {string} accessToken - user's access token
 * @property {string} refreshToken - user's refresh token for getting new tokens pair
 * @property {User} data - user's data
 */

/**
 * Creates module state
 * @return {AuthModuleState}
 */
function initialState() {
  return {
    accessToken: '',
    refreshToken: '',
    data: null
  };
}

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
   *
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   * @return {Promise<boolean>} - sign up status
   */
  async [SIGN_UP]({ commit }, user) {
    return authApi.signUp(user.email);
  },

  /**
   * Send login request to the server and performs user login
   *
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   */
  async [LOGIN]({ commit }, user) {
    const tokens = await authApi.login(user.email, user.password);

    commit(mutationTypes.SET_TOKENS, tokens);
  },

  /**
   * Set tokens after callback from OAuth
   *
   * @param {function} commit - standard Vuex commit function
   * @param {TokensPair} tokens - user's auth tokens
   */
  async [SET_TOKENS]({ commit }, tokens) {
    commit(mutationTypes.SET_TOKENS, tokens);
  },

  /**
   * Send request for refreshing tokens pair
   *
   * @param {function} commit - standard Vuex commit function
   * @param {AuthModuleState} state - vuex state
   * @return {Promise<TokensPair>}
   */
  async [REFRESH_TOKENS]({ commit, state }) {
    const tokens = await authApi.refreshTokens(state.refreshToken);

    commit(mutationTypes.SET_TOKENS, tokens);

    return tokens;
  },

  /**
   * Send request to fetch current user data
   *
   * @param {function} commit - standard Vuex commit function
   */
  async [FETCH_CURRENT_USER]({ commit }) {
    const me = await authApi.fetchCurrentUser();

    commit(mutationTypes.SET_CURRENT_USER, me);
  },

  /**
   * Send request to update user profile data
   *
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params to update
   */
  async [UPDATE_PROFILE]({ commit }, user) {
    return authApi.updateProfile(user.name, user.email);
  },

  /**
   * Send request to change user password
   *
   * @param {function} commit - standard Vuex commit function
   * @param {Passwords} passwords - user's pair of passwords
   */
  async [CHANGE_PASSWORD]({ commit }, passwords) {
    return authApi.changePassword(passwords.old, passwords.new);
  },

  /**
   * Resets github data
   *
   * @param {function} commit - standard Vuex commit function
   */
  async [RESET_GITHUB]({ commit }) {
    commit(mutationTypes.RESET_GITHUB);
  },

  /**
   * Resets google data
   *
   * @param {function} commit - standard Vuex commit function
   */
  async [RESET_GOOGLE]({ commit }) {
    commit(mutationTypes.RESET_GOOGLE);
  },

  /**
   * Resets module state
   *
   * @param {function} commit - standard Vuex commit function
   */
  [RESET_STORE]({ commit }) {
    commit(RESET_STORE);
  }
};

const mutations = {
  /**
   * Mutation caused by successful authentication
   *
   * @param {AuthModuleState} state - Vuex state
   * @param {string} accessToken - user's access token
   * @param {string} refreshToken - user's refresh token for getting new tokens pair
   */
  [mutationTypes.SET_TOKENS](state, { accessToken, refreshToken }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
  },

  /**
   * Set users data to state
   *
   * @param {AuthModuleState} state - Vuex state
   * @param {User} user – user's object to set
   */
  [mutationTypes.SET_CURRENT_USER](state, user) {
    state.data = user;
  },

  /**
   * Reset github data
   *
   * @param {AuthModuleState} state - Vuex state
   */
  [mutationTypes.RESET_GITHUB](state) {
    Vue.set(state, 'github', {});
  },

  /**
   * Reset google data
   *
   * @param {AuthModuleState} state - Vuex state
   */
  [mutationTypes.RESET_GOOGLE](state) {
    Vue.set(state, 'google', {});
  },

  /**
   * Resets module state
   *
   * @param {AuthModuleState} state - Vuex state
   */
  [RESET_STORE](state) {
    Object.assign(state, initialState());
  }
};

export default {
  state: initialState(),
  getters,
  actions,
  mutations
};
