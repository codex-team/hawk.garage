// language=GraphQL
/**
 * Login mutation
 */
export const QUERY_EVENT = `
query Event($projectId: ID!, $eventId: ID!){
  event(projectId: $projectId, eventId: $eventId) {
    id
    catcherType
    payload {
      title
    }
  }
}
`;
