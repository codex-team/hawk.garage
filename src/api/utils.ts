/**
 * Prepares FormData object for requests with files
 *
 * @param {String} request - request to send
 * @param {Object} [variables] - request variables
 * @param {Object} [files] - files to upload
 *
 * @returns {FormData}
 */
export function prepareFormData(
  request: string,
  variables: any,
  files: {[name: string]: File | undefined}
) {
  Object
    .keys(files)
    .forEach(name => {
      variables[name] = null;
    });

  const operation = {
    query: request,
    variables,
  };

  const map: {[name: string]: string[]} = {};

  Object
    .keys(files)
    .forEach(name => {
      map[name] = [ `variables.${name}` ];
    });

  const formData = new FormData();

  formData.append('operations', JSON.stringify(operation));
  formData.append('map', JSON.stringify(map));

  Object
    .entries(files)
    .forEach(([name, file]) => {
      formData.append(name, file!, file!.name);
    });

  return formData;
};
