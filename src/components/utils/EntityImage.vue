<template>
  <div
    class="entity-image"
    :style="{
      backgroundImage: imageSrc ? `url('${imageSrc}')`: 'none',
      backgroundColor: bgColor
    }"
  >
    {{ !imageSrc ? $options.filters.abbreviation(name) : '' }}
  </div>
</template>

<script>
import { getEntityColor } from '../../utils';

export default {
  name: 'EntityImage',
  props: {
    /**
     * Entity name for making abbreviation
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * Entity image URL
     */
    image: {
      type: String,
      default: null,
    },

    /**
     * Entity id for picking default background color (hex string)
     */
    id: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      /**
       * @type {string | null} Internal field for image URL
       */
      imageSrc: null,

      /**
       * @type {HTMLImageElement | null} image element for displaying icons
       */
      imageElement: null,
    };
  },
  computed: {
    /**
     * @returns {String} image background color (if image URL is not provided)
     */
    bgColor() {
      if (this.imageSrc) {
        return 'none';
      }
      if (this.id) {
        return getEntityColor(this.id);
      }

      return 'rgba(0,0,0, 0.3)';
    },
  },
  watch: {
    /**
     * Change entity image after image prop changed
     * @param {string} newValue - new value of the image property
     */
    image(newValue) {
      this.imageElement.src = newValue;
    },
  },
  mounted() {
    if (!this.image) {
      this.imageSrc = null;

      return;
    }

    this.imageElement = new Image();

    this.imageElement.src = this.image;

    this.imageElement.onload = () => {
      this.imageSrc = this.image;
    };

    this.imageElement.onerror = (e) => {
      this.imageSrc = null;
    };
  },
};
</script>

<style>
  .entity-image {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    letter-spacing: -0.4px;
    background-position: center center;
    background-size: cover;
    border-radius: var(--border-radius);
  }
</style>
