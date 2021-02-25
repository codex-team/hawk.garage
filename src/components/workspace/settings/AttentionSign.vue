<template>
  <div class="attention">
    <div class="attention__sign">
      !
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'AttentionSign',
});

</script>

<style>
  @import url('./../../../styles/custom-properties.css');

  .attention {
    display: inline-block;
    width: 18px;
    height: 18px;
    padding: 1px 7px;
    background-color: var(--color-indicator-critical);
    border-radius: 50%;

    &__sign {
      width: 2px;
      height: 10px;
    }
  }
</style>
