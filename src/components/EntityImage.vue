<template>
  <div
    class="entity-image"
    :style="{
      backgroundImage: image ? `url('${image}')`: 'none',
      backgroundColor: bgColor
    }"
  >
    {{!image ? $options.filters.abbreviation(name) : ''}}
  </div>
</template>

<script>
import { getEntityColor } from '../utils';

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
    image: String,

    /**
     * Entity id for picking default background color (hex string)
     */
    id: String
  },
  data() {
    return {
      /**
       * @type {String} image background color (if image URL is not provided)
       */
      bgColor: this.image ? 'none' : getEntityColor(this.id)
    };
  }
};
</script>

<style>
  .entity-image {
    font-weight: bold;
    font-size: 12px;
    line-height: 36px;
    text-align: center;
    background-position: center center;
    background-size: cover;
    border-radius: var(--border-radius);
  }
</style>
