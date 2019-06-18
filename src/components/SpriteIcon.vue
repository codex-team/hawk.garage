<template>
  <svg :width="width" :height="height">
    <use :xlink:href="`${svgPath}#${symbol}`"></use>
  </svg>
</template>
<script>
import svgPath from '../assets/sprite.svg';

export default {
  name: 'SpriteIcon',
  props: ['symbol', 'width', 'height'],
  data() {
    return {
      svgPath
    };
  }

};
</script>
