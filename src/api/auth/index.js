import axios from 'axios';

/**
 * Auth endpoint
 */
const AUTH_INIT = process.env.VUE_APP_API_AUTH_INIT || 'http://localhost:4000/auth/init';

/**
 * Call auth init. Needed to perform linking or unlinking.
 */
export async function authInit() {
  return axios.get(AUTH_INIT, { withCredentials: true });
}
