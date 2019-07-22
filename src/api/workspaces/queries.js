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
