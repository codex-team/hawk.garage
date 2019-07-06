<template>
  <svg :class="`icon icon--${symbol}`">
    <use :xlink:href="`${svgPath}#${symbol}`"></use>
  </svg>
</template>
<script>
import svgPath from '../assets/sprite.svg';

export default {
  name: 'Icon',
  props: [ 'symbol' ],
  data() {
    return {
      svgPath
    };
  }
};
</script>

<style>
  .icon {
    display: flex;
    text-align: center;
  }
</style>
