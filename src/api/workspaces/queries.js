/**
 * Query for getting all user's workspaces and project.
 */
export const QUERY_ALL_WORKSPACES_WITH_PROJECTS = `
{
  workspaces {
    id
    name
    description
    projects {
      id
    }
  }
}
`;

export const MUTATION_CREATE_WORKSPACE = `
  mutation createWorkspace(
    $name: String!,
    $description: String!,
    $image: String
  ) {
    createWorkspace(name: $name, description: $description, image: $image){
      id
    }
  }
`;
