/**
 * Mutation for creating new project
 */
// language=GraphQL
export const MUTATION_CREATE_PROJECT = `
  mutation createProject(
    $name: String!,
    $workspaceId: ID!
    $image: Upload
  ) {
    createProject(name: $name, workspaceId: $workspaceId, image: $image) {
      id
      name
      image
    }
  }
`;

// language=GraphQL
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

// language=GraphQL
export const MUTATION_UPDATE_LAST_VISIT = `
    mutation lastProjectVisit($projectId: ID!) {
        updateLastProjectVisit(projectId: $projectId)
    }
`;

// language=GraphQL
/**
 * Mutation for project updating
 */
export const MUTATION_UPDATE_PROJECT = `
  mutation updateProject(
    $id: ID!
    $name: String!
    $description: String
    $image: Upload
  ) {
    updateProject(id: $id, name: $name, description: $description, image: $image)
    {
      id
      name
      description
      image
    }
  }
`;
