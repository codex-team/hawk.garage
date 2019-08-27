// language=GraphQL
/**
 * Query for getting all user's workspaces and project.
 */
export const QUERY_ALL_WORKSPACES_WITH_PROJECTS = `
  {
    workspaces {
      id
      name
      image
      projects {
        id
        name
        image
        recentEvents(limit: 1) {
          event {
            payload {
              title
              timestamp
            }
          }
          count
          date
        }
      }
    }
  }
`;

// language=GraphQL
/**
 * Mutation for creating new workspace
 */
export const MUTATION_CREATE_WORKSPACE = `
  mutation createWorkspace(
    $name: String!,
    $image: String
  ) {
    createWorkspace(name: $name, image: $image) {
      id
      name
      description
      image
    }
  }
`;

// language=GraphQL
/**
 * Query for fetching workspaces with id
 */
export const QUERY_WORKSPACES = `
 query fetchWorkspaces($ids: [ID!]) {
     workspaces(ids: $ids) {
         id
         name
         description
         image
     }
 }
`;

// language=GraphQL
/**
 * Mutation for workspace updating
 */
export const MUTATION_UPDATE_WORKSPACE = `
  mutation updateWorkspace(
      $id: ID!
      $name: String!
      $description: String
  ) {
      updateWorkspace(id: $id, name: $name, description: $description)
  }
`;
