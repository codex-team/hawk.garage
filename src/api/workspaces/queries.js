/**
 * Query for getting all user's workspaces and project.
 */
export const QUERY_ALL_WORKSPACES_WITH_PROJECTS = `
{
  workspaces {
    id
    name
    description
    image
    projects {
      id
      name
      image
      events {
        id
        payload {
          title
          timestamp
          backtrace {
            file
            line
            sourceCode {
              line
              content
            }
          }
        }
      }
    }
  }
}
`;

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
    }
  }
`;
