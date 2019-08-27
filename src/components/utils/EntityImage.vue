<template>
  <div
    class="entity-image"
    :style="{
      backgroundImage: image ? `url('${image}')`: 'none',
      backgroundColor: bgColor
    }"
  >
    {{ !image ? $options.filters.abbreviation(name) : '' }}
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
      required: true
    },

    /**
     * Entity image URL
     */
    image: {
      type: String,
      default: null
    },

    /**
     * Entity id for picking default background color (hex string)
     */
    id: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    /**
     * @returns {String} image background color (if image URL is not provided)
     */
    bgColor() {
      if (this.image) {
        return 'none';
      }
      if (this.id) {
        return getEntityColor(this.id);
      }
      return 'rgba(0,0,0, 0.3)';
    }
  }
};
</script>

<style>
  .entity-image {
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    line-height: 36px;
    letter-spacing: -0.4px;
    text-align: center;
    background-position: center center;
    background-size: cover;
    border-radius: var(--border-radius);
  }
</style>
