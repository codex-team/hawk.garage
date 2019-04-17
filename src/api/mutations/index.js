import fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'utils';

const readFile = promisify(fs.readFile);

let mutations = {};

/**
 * Singleton for loading .gql files
 *
 * @param {string} name Name of the file
 * @returns {string} Loaded query/mutation
 */
export default name => {
  if (mutations[name]) {
    return mutations[name];
  } else {
    readFile(resolve(__dirname, name))
      .then(data => {
        mutations[name] = data.toString();
        return mutations[name];
      })
      .catch(err => {
        throw err;
      });
  }
};
