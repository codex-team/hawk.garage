import { USER_NOTIFICATIONS_FRAGMENT } from '../fragments';

// language=GraphQL
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

// language=GraphQL
/**
 * SignUp mutation
 */
export const MUTATION_SIGN_UP = `
mutation signUp($email: String!) {
  signUp(email: $email)
}
`;

// language=GraphQL
/**
 * Recover password mutation
 */
export const MUTATION_RECOVER_PASSWORD = `
mutation recoverPassword($email: String!) {
  resetPassword(email: $email)
}
`;

// language=GraphQL
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

// language=GraphQL
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

// language=GraphQL
/**
 * Mutation to update user profile
 */
export const MUTATION_UPDATE_PROFILE = `
mutation User($name: String!, $email: String!, $image: Upload) {
  updateProfile (
    name: $name
    email: $email
    image: $image
  )
}
`;

// language=GraphQL
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

// language=GraphQL
/**
 * Query to get current user
 */
export const QUERY_CURRENT_USER_WITH_NOTIFICATIONS = `
${USER_NOTIFICATIONS_FRAGMENT}

query getCurrentUser {
  me {
    notifications {
      ...UserNotifications
    }
  }
}
`;

// language=GraphQL
/**
 * Mutation to update user notifications channel
 */
export const MUTATION_CHANGE_USER_NOTIFICATIONS_CHANNEL = `
  mutation changeUserNotificationsChannel($input: NotificationsChannelsInput!) {
    changeUserNotificationsChannel (
      input: $input
    ) {
      notifications {
        ...UserNotifications
      }
    }
  }

  ${USER_NOTIFICATIONS_FRAGMENT}
`;

// language=GraphQL
/**
 * Mutation to update user notifications receive type
 */
export const MUTATION_CHANGE_USER_NOTIFICATIONS_RECEIVE_TYPE = `
  mutation changeUserNotificationsReceiveType($input: ChangeUserNotificationsReceiveTypeInput!) {
    changeUserNotificationsReceiveType (
      input: $input
    ) {
      notifications {
        ...UserNotifications
      }
    }
  }

  ${USER_NOTIFICATIONS_FRAGMENT}
`;
