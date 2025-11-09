/**
 * Prepares FormData object for requests with files
 * @param request - request to send
 * @param [variables] - request variables
 * @param [files] - files to upload
 * @returns
 */
export function prepareFormData(
  request: string,
  variables: Record<string, unknown> | undefined,
  files: { [name: string]: File | undefined }
): FormData {
  Object
    .keys(files)
    .forEach((name) => {
      if (variables) {
        variables[name] = null;
      }
    });

  const operation = {
    query: request,
    variables,
  };

  const map: { [name: string]: string[] } = {};

  Object
    .keys(files)
    .forEach((name) => {
      map[name] = [`variables.${name}`];
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
}
