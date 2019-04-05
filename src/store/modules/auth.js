/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/auth';
import { USER_REQUEST } from '../actions/user';
import axios from 'axios';

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  hasLoadedOnce: false
};

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
};

const actions = {
  [AUTH_REQUEST]({ commit, dispatch }, user) {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST);
      axios.get('/login?email=' + user.email + '&password=' + user.password)
        .then(resp => {
          const token = resp.data.jwt;

          localStorage.setItem('user-token', token);
          axios.defaults.headers.common['Authorization'] = token;
          commit(AUTH_SUCCESS, resp);
          dispatch(USER_REQUEST);
          resolve(resp);
        })
        .catch(err => {
          commit(AUTH_ERROR, err);
          localStorage.removeItem('user-token');
          reject(err);
        });
    });
  },
  [AUTH_LOGOUT]({ commit }){
    return new Promise((resolve) => {
      commit(AUTH_LOGOUT);
      localStorage.removeItem('user-token');
      resolve();
    });
  }
};

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success';
    state.token = resp.data.jwt;
    state.hasLoadedOnce = true;
  },
  [AUTH_ERROR]: (state) => {
    state.status = 'error';
    state.hasLoadedOnce = true;
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = '';
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
