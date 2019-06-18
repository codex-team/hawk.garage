<template>
  <svg>
    <use :xlink:href="`${svgPath}#${symbol}`"></use>
  </svg>
</template>
<script>
import svgPath from '../assets/sprite.svg';

export default {
  name: 'SpriteIcon',
  props: [ 'symbol' ],
  data() {
    return {
      svgPath
    };
  }

};
</script>

<style>
  .icon--color-main {
    fill: white;
  }
</style>
