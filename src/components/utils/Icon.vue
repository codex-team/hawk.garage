<template>
  <svg
    :class="className"
    xmlns="http://www.w3.org/2000/svg"
  >
    <use :xlink:href="iconId" />
  </svg>
</template>

<script>
export default {
  name: 'Icon',

  props: {
    /**
     * Icon name
     */
    symbol: {
      type: String,
      required: true,
    },
  },

  computed: {
    /**
     * Return icon id selector string for vite-plugin-svg-icons
     *
     * @returns {string}
     */
    iconId() {
      return `#icon-${this.symbol}`;
    },

    /**
     * Returns icon classname
     *
     * @returns {string}
     */
    className() {
      return `icon icon--${this.symbol}`;
    },
  },
};
</script>
