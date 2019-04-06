/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT, SIGN_UP_REQUEST } from '../actions/auth';
import axios from 'axios';
import router from '../../router';

const apiMockup = {
  login(email, password) {
    return { accessToken: `${email}${password}` };
  },
  signUp(email) {
    return { accessToken: `${email}password` };
  }
};

const state = {
  token: localStorage.getItem('access-token') || '',
  status: ''
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
};

const actions = {
  async [SIGN_UP_REQUEST]({ commit, dispatch }, user) {
    try {
      const response = await apiMockup.signUp(user.email);

      commit(AUTH_SUCCESS, response);
    } catch (e) {
      commit(AUTH_ERROR);
      throw e;
    }
  },
  async [AUTH_REQUEST]({ commit, dispatch }, user) {
    commit(AUTH_REQUEST);

    try {
      const response = await apiMockup.login(user.email, user.password);

      commit(AUTH_SUCCESS, response);
    } catch (e) {
      commit(AUTH_ERROR);
      throw e;
    }
  }
};

const mutations = {
  [AUTH_REQUEST](state) {
    state.status = 'loading';
  },
  [AUTH_SUCCESS](state, response) {
    const accessToken = response.accessToken;

    localStorage.setItem('access-token', accessToken);
    axios.defaults.headers.common['Authorization'] = accessToken;
    state.status = 'success';
    state.token = accessToken;
  },
  [AUTH_ERROR](state) {
    router.push('/login');
    localStorage.removeItem('access-token');
    state.token = '';
    state.status = 'error';
  },
  [AUTH_LOGOUT](state) {
    router.push('/login');
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
