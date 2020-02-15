<template>
  <svg :class="`icon icon--${symbol}`">
    <use :xlink:href="`#${symbol}`" />
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    symbol: {
      type: String,
      required: true
    }
  }
};
</script>
