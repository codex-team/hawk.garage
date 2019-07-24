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
      events(limit: 30) {
        id
        payload {
          title
          timestamp
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
