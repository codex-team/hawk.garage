<template>
  <svg :class="`icon icon--${symbol}`">
    <use :xlink:href="`#${symbol}`"></use>
  </svg>
</template>
<script>
export default {
  name: 'Icon',
  props: [ 'symbol' ]
};
</script>
