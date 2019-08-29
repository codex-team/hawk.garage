// language=GraphQL
/**
 * Get specific error
 */
export const QUERY_EVENT = `
query Event($projectId: ID!, $eventId: ID!){
  event(projectId: $projectId, eventId: $eventId) {
    id
    catcherType
    payload {
      title
      backtrace {
        line
        sourceCode {
          line
          content
        }
        file
      }
    }
  }
}
`;
