/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT, SIGN_UP_REQUEST } from '../actions/auth';
import axios from 'axios';
import router from '../../router';
import * as authApi from '../../api/auth';

/**
 * @typedef User - represents user
 * @type {object}
 * @property {string} email - user's email
 * @property {string} password - user's password
 */

/**
 * Enum of auth states
 * @type {{success: string, loading: string, error: string}}
 */
const AUTH_STATES = {
  loading: 'loading',
  success: 'success',
  error: 'error',
  notLoggedIn: 'notLoggedIn'
};

/**
 * Module state
 * @typedef AuthModuleState
 * @type {object}
 * @property {string} token - user's access token
 * @property {status} status - current auth status
 */
const state = {
  token: '',
  status: AUTH_STATES.notLoggedIn
};

const getters = {
  /**
   * Returns true if the user is authenticated else false
   * @param {AuthModuleState} state - vuex state
   * @return {boolean}
   */
  isAuthenticated: state => !!state.token
};

const actions = {
  /**
   * Send sign up request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   */
  async [SIGN_UP_REQUEST]({ commit }, user) {
    try {
      const token = await authApi.signUp(user.email);

      commit(AUTH_SUCCESS, token);
    } catch (e) {
      commit(AUTH_ERROR);
      throw e;
    }
  },

  /**
   * Send login request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {User} user - user's params for auth
   */
  async [AUTH_REQUEST]({ commit }, user) {
    commit(AUTH_REQUEST);

    try {
      const token = await authApi.login(user.email, user.password);

      console.log(token);
      commit(AUTH_SUCCESS, token);
    } catch (e) {
      commit(AUTH_ERROR);
      throw e;
    }
  }
};

const mutations = {
  /**
   * Mutation caused by authentication request
   * @param {AuthModuleState} state - Vuex state
   */
  [AUTH_REQUEST](state) {
    state.status = AUTH_STATES.loading;
  },

  /**
   * Mutation caused by successful authentication
   * @param {AuthModuleState} state - Vuex state
   * @param {string} accessToken - user's access token
   */
  [AUTH_SUCCESS](state, accessToken) {
    axios.defaults.headers.common['Authorization'] = accessToken;
    state.status = AUTH_STATES.success;
    state.token = accessToken;
  },

  /**
   * Mutation caused by unsuccessful authentication
   * @param {AuthModuleState} state - Vuex state
   */
  [AUTH_ERROR](state) {
    this.commit(AUTH_LOGOUT);
    state.status = AUTH_STATES.error;
  },

  /**
   * Mutation caused when user logout
   * @param {AuthModuleState} state - Vuex state
   */
  [AUTH_LOGOUT](state) {
    router.push('/login');
    delete axios.defaults.headers.common['Authorization'];
    state.token = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
