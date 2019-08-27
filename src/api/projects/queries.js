/**
 * Mutation for creating new project
 */
export const MUTATION_CREATE_PROJECT = `
  mutation createProject(
    $name: String!,
    $workspaceId: ID!
  ) {
    createProject(name: $name, workspaceId: $workspaceId) {
      id
      name
      image
    }
  }
`;

export const QUERY_RECENT_ERRORS = `
  query RecentErrors($projectId: ID!) {
    recent(projectId: $projectId) {
      date
      count
      event {
        id
        payload {
          title
          timestamp
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
