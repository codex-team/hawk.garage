/**
 * Structure represents record in team:<projectId> collection
 */
export const MEMBER_FRAGMENT = `
  fragment Member on Member {
    id
    userId
    name
    email
    isAdmin
    isPending
  }
`;

/**
 * Structure represents user
 */
export const USER_FRAGMENT = `
  fragment User on User {
    id
    email
    name
    image
  }
`;

/**
 * Structure represents event backtrace
 */
export const EVENT_BACKTRACE = `
  fragment eventBacktrace on EventBacktraceFrame {
    file
    line
    column
    sourceCode {
      line
      content
    }
    function
    arguments
  }
`;
