/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT, SIGN_UP_REQUEST } from '../actions/auth';
import axios from 'axios';
import router from '../../router';

/**
 * @typedef User - represents user
 * @property {string} email - user's email
 * @property {string} password - user's password
 */

/**
 * Temporary mockup api
 */
const apiMockup = {
  login(email, password) {
    return { accessToken: `${email}${password}` };
  },
  signUp(email) {
    return { accessToken: `${email}password` };
  }
};

const state = {
  token: localStorage.getItem('access-token') || '', // user's access token
  status: '' // current auth status
};

const getters = {
  /**
   * Returns true if the user is authenticated else false
   * @param {object} state - vuex state
   * @return {boolean}
   */
  isAuthenticated: state => !!state.token
};

const actions = {
  /**
   * Send sign up request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {function} dispatch - standard Vuex dispatch function
   * @param {User} user - user's params for auth
   */
  async [SIGN_UP_REQUEST]({ commit, dispatch }, user) {
    try {
      const response = await apiMockup.signUp(user.email);

      commit(AUTH_SUCCESS, response);
    } catch (e) {
      commit(AUTH_ERROR);
      throw e;
    }
  },

  /**
   * Send login request to the server and performs user login
   * @param {function} commit - standard Vuex commit function
   * @param {function} dispatch - standard Vuex dispatch function
   * @param {User} user - user's params for auth
   */
  async [AUTH_REQUEST]({ commit, dispatch }, user) {
    commit(AUTH_REQUEST);

    try {
      const response = await apiMockup.login(user.email, user.password);

      commit(AUTH_SUCCESS, response.accessToken);
    } catch (e) {
      commit(AUTH_ERROR);
      throw e;
    }
  }
};

const mutations = {
  /**
   * Mutation caused by authentication request
   * @param {object} state - Vuex state
   */
  [AUTH_REQUEST](state) {
    state.status = 'loading';
  },

  /**
   * Mutation caused by successful authentication
   * @param {object} state - Vuex state
   * @param {string} accessToken - user's access token
   */
  [AUTH_SUCCESS](state, accessToken) {
    localStorage.setItem('access-token', accessToken);
    axios.defaults.headers.common['Authorization'] = accessToken;
    state.status = 'success';
    state.token = accessToken;
  },

  /**
   * Mutation caused by unsuccessful authentication
   * @param {object} state - Vuex state
   */
  [AUTH_ERROR](state) {
    router.push('/login');
    localStorage.removeItem('access-token');
    delete axios.defaults.headers.common['Authorization'];
    state.token = '';
    state.status = 'error';
  },

  /**
   * Mutation caused when user logout
   * @param {object} state - Vuex state
   */
  [AUTH_LOGOUT](state) {
    router.push('/login');
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('access-token');
    state.token = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
