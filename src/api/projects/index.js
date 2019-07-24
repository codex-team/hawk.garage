import { MUTATION_CREATE_PROJECT } from './queries';
import * as api from '../index';

/**
 * Create project and returns its id
 * @param {Project} projectInfo - project to create
 * @return {Promise<Project.id>}
 */
export async function createProject(projectInfo) {
  return (await api.call(MUTATION_CREATE_PROJECT, projectInfo)).createProject;
}
