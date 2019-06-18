<template>
  <svg>
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
