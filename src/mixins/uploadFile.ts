/**
 * Available options of the uploading
 */
export interface UploadFileOptions {
  /**
   * Allows to select several files
   */
  multiple?: boolean;

  /**
   * Allows to specify file mime-types. File browser will filter files by this types.
   */
  accept?: string;
}

/**
 * Mixin to add uploadFile method to component
 */
export const uploadFile = {
  methods: {
    /**
     * Creates file input and requests from user a file to upload
     * @param options - uploading options
     */
    async uploadFile(options: UploadFileOptions = {}): Promise<FileList | null> {
      const input = document.createElement('input');

      input.type = 'file';

      /**
       * Append element to the body to make upload fork on mobile devices and in Safari
       */
      input.style.display = 'none';
      document.body.appendChild(input);

      if (options.multiple) {
        input.setAttribute('multiple', 'multiple');
      }

      if (options.accept) {
        input.setAttribute('accept', options.accept);
      }

      return new Promise((resolve) => {
        /**
         * Input onChange callback
         */
        function onChange(): void {
          input.removeEventListener('change', onChange);

          const files = input.files;

          input.remove();

          resolve(files);
        }

        input.addEventListener('change', onChange);

        input.click();
      });
    },
  },
};
