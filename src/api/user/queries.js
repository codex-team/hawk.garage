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
mutation signUp($email: String!) {
  signUp(email: $email)
}
`;

/**
 * Mutation for refreshing tokens
 */
export const MUTATION_REFRESH_TOKENS = `
mutation refreshTokens($refreshToken: String!) {
  refreshTokens(refreshToken: $refreshToken) {
    accessToken
    refreshToken
  }
}
`;

/**
 * Query to get current user
 */
export const QUERY_CURRENT_USER = `
query getCurrentUser {
  me {
    id
    name
    email
    image
  }
}
`;

/**
 * Mutation to update user profile
 */
export const MUTATION_UPDATE_PROFILE = `
mutation User($name: String!, $email: String!, image: Upload) {
  updateProfile (
    name: $name
    email: $email
    image: $image
  )
}
`;

/**
 * Mutation to change user password
 */
export const MUTATION_CHANGE_PASSWORD = `
mutation User($oldPassword: String!, $newPassword: String!) {
  changePassword (
    oldPassword: $oldPassword
    newPassword: $newPassword
  )
}
`;
