/**
 * Prepares FormData object for requests with files
 *
 * @param {string} request - request to send
 * @param {object} [variables] - request variables
 * @param {object} [files] - files to upload
 *
 * @returns {FormData}
 */
export function prepareFormData(
  request: string,
  variables: object | undefined,
  files: {[name: string]: File | undefined}
): FormData {
  Object
    .keys(files)
    .forEach(name => {
      if (variables) {
        // eslint-disable-next-line
        variables[name] = null;
      }
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      formData.append(name, file!, file!.name);
    });

  return formData;
}
