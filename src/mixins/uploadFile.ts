export interface UploadFileOptions {
  multiple?: boolean;
  accept?: string;
}

export const uploadFile = {
  methods: {
    async uploadFile(options: UploadFileOptions = {}): Promise<FileList> {
      const input = document.createElement('input');

      input.type = 'file';

      if (options.multiple) {
        input.setAttribute('multiple', 'multiple');
      }

      if (options.accept) {
        input.setAttribute('accept', options.accept);
      }

      return new Promise(resolve => {
        input.addEventListener('change', () => {
          resolve(input.files);
        });

        input.click();
      });
    }
  }
};
