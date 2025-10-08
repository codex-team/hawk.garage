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
     * Require sprite icon & return id selector string
     *
     * @returns {string}
     */
    iconId() {
      import(`../../assets/sprite-icons/${this.symbol}.svg?url`);

      return `#${this.symbol}`;
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
