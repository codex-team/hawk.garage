/**
 * Login mutation
 */
export const MUTATION_LOGIN = async () => (await import(/* webpackChunkName: 'loginMutation' */'./login.graphql')).default;

/**
 * SignUp mutation
 */
export const MUTATION_SIGN_UP = async () => (await import(/* webpackChunkName: 'signUpMutation' */'./signUp.graphql')).default;
