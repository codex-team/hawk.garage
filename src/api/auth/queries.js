/**
 * Login mutation
 */
export const MUTATION_LOGIN = `
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    refreshToken
  }
}
`;

/**
 * SignUp mutation
 */
export const MUTATION_SIGN_UP = `
mutation SignUp($email: String!) {
  signUp(email: $email) {
    accessToken
    refreshToken
  }
}
`;
