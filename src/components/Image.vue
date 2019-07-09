<template>
  <div
    class="image"
    :style="{
      backgroundImage: workspace.image ? `url('${workspace.image}')`: 'none',
      backgroundColor: bgColor
    }"
  >
    {{!image ? $options.filters.abbreviation(name) : ''}}
  </div>
</template>

<script>
import { getRandomColor } from '../utils';

export default {
  name: 'Image',
  props: {
    /**
     * Name for making abbreviation
     */
    name: {
      type: String,
      required: true
    },
    /**
     * Image URL
     */
    image: String,

    /**
     * Id for picking default background color
     */
    id: String
  },
  data() {
    return {
      /**
       * @type {String} item background color
       */
      bgColor: this.image ? 'none' : getRandomColor()
    };
  }
};
</script>

<style>

</style>
