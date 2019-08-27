import { MUTATION_CREATE_PROJECT, QUERY_REPETITION_LIST } from './queries';
import * as api from '../index';

/**
 * Create project and returns its id
 * @param {Project} projectInfo - project to create
 * @return {Promise<Project.id>}
 */
export async function createProject(projectInfo) {
  return (await api.call(MUTATION_CREATE_PROJECT, projectInfo)).createProject;
}

/**
 * @param projectId
 * @param eventId
 * @return {Promise<*>}
 */
export async function getRepetitions(projectId, eventId) {
  return (await api.call(QUERY_REPETITION_LIST, { projectId, eventId })).repetitions;
}
