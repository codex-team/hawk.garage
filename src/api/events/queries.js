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

export const QUERY_REPETITION_LIST = `
  query repetitionsList(
    $projectId: ID!,
    $eventId: ID!
  ) {
    repetitions(projectId: $projectId, eventId: $eventId, limit: 30) {
      id
      catcherType
      payload {
         title
         timestamp
      }
    }
  } 
`;
