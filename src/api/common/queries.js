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
      events(limit: 1) {
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
