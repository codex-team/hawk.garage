<template>
  <div
    class="form-image-uploader"
    :class="{
      'form-image-uploader--with-image': imageSrc !== null
    }"
    :style="{backgroundImage: `url(${imageSrc})`}"
    @click="upload"
  >
    {{ $t('forms.imageUploader') }}
  </div>
</template>

<script>
import { uploadFile } from '../../mixins/uploadFile';

export default {
  name: 'FormImageUploader',
  mixins: [ uploadFile ],
  props: {
    /**
     * Watched prop to pass image URL from external
     */
    image: {
      type: String,
      default: null
    }
  },
  data: () => ({
    /**
     * Internal field for URL to uploaded image
     */
    imageSrc: null
  }),
  watch: {
    image(newVal) {
      this.imageSrc = newVal;
    }
  },
  mounted() {
    const img = new Image();

    img.src = this.image;

    img.onload = () => {
      this.imageSrc = this.image;
    };

    img.onerror = (e) => {
      this.imageSrc = null;
    };
  },
  methods: {
    async upload() {
      const files = await this.uploadFile({ accept: 'image/*' });

      this.useTempImage(files[0]);

      this.$emit('change', files[0]);
    },
    useTempImage(file) {
      this.imageSrc = URL.createObjectURL(file);
    }
  }
};
</script>

<style>
  .form-image-uploader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 60px;
    height: 60px;
    color: transparent;
    font-weight: bold;
    font-size: 10px;
    line-height: 1.3;
    text-align: center;
    border-radius: var(--border-radius);
    cursor: pointer;
    user-select: none;
  }

  .form-image-uploader--with-image {
    background-position: 50%;
    background-size: cover;
  }

  .form-image-uploader--with-image:hover,
  .form-image-uploader:not(.form-image-uploader--with-image) {
    color: var(--color-text-second);
    border: 1px dashed var(--color-text-second);
  }
</style>
