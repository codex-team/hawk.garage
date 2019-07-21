import { QUERY_ALL_WORKSPACES_WITH_PROJECTS } from './queries';
import * as api from '../index';

/**
 * Returns all user's workspaces and project.
 * @return {Promise<[Workspace]>}
 */
export async function getAllWorkspacesWithProjects() {
  return (await api.call(QUERY_ALL_WORKSPACES_WITH_PROJECTS)).workspaces;
}
