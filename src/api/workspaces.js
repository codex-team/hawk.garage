import { HTTP_OK } from './httpCodes';
import uuid from 'uuid/v4';

/**
 * Mock api? true/false
 */
const MOCK = process.env.VUE_APP_API_MOCK;

/**
 * Enum of workspaces module errors
 * @enum {String}
 */
export const WORKSPACES_ERROR = {
  CREATE: 'An error occurred during the creating attempt',
  DELETE: 'An error occurred during the deletion attempt',
  UNKNOWN: 'Unknown error occurred'
};

/**
 * Create workspace and return it
 * @param {Workspace} workspace - workspace to create
 * @returns {Promise<Workspace>} created workspace
 * @throws {Error} Workspaces error occurred.
 */
export async function createWorkspace(workspace) {
  let resp;

  try {
    if (!MOCK) {
      // @todo make real request to API
    } else {
      resp = {
        status: HTTP_OK,
        data: {
          id: uuid(),
          name: workspace.name
        }
      };
    }
  } catch (e) {
    throw new Error(WORKSPACES_ERROR.CREATE);
  }

  if (resp.status === HTTP_OK) {
    return resp.data;
  } else {
    throw new Error(WORKSPACES_ERROR.UNKNOWN);
  }
}

/**
 * Remove workspace by id return status (ok)
 * @param {string} workspaceId - workspaces id to delete
 * @returns {Promise<boolean>} Response status
 * @throws {Error} Workspaces error occured.
 */
export async function deleteWorkspace(workspaceId) {
  let resp;

  try {
    if (!MOCK) {
      // @todo make real request to API
    } else {
      resp = {
        status: HTTP_OK
      };
    }
  } catch (e) {
    throw new Error(WORKSPACES_ERROR.DELETE);
  }

  if (resp.status === HTTP_OK) {
    return true;
  } else {
    throw new Error(WORKSPACES_ERROR.UNKNOWN);
  }
}

/**
 * Returns all user's workspaces and project.
 * @return {Promise<[Workspace]>}
 */
export async function getAllWorkspacesAndProject() {
  let resp;

  try {
    if (!MOCK) {
      // @todo make real request to API
    } else {
      resp = {
        status: HTTP_OK,
        data: {
          workspaces: [
            {
              name: 'EditorJS',
              id: '020302402349234',
              picture: 'https://capella.pics/fd1a93ac-f8e2-4b4b-911e-568359e777ec.jpg',
              projects: [
                {
                  name: 'codex.so main page',
                  id: '2342594'
                },
                {
                  name: 'php backend',
                  id: '2342342367'
                }
              ]
            },
            {
              name: 'Hawk.so',
              id: '342342342343',
              picture: 'https://capella.pics/9a7e51f7-2629-4040-9aab-e836fc6ee30c.jpg',
              projects: [
                {
                  name: 'Garage',
                  id: '23425awd94'
                },
                {
                  name: 'GraphQL API',
                  id: '2342awd342367'
                }
              ]
            }
          ]
        }
      };
    }
  } catch (e) {
    throw new Error(WORKSPACES_ERROR.UNKNOWN);
  }

  if (resp.status === HTTP_OK) {
    return resp.data.workspaces;
  } else {
    throw new Error(WORKSPACES_ERROR.UNKNOWN);
  }
}
