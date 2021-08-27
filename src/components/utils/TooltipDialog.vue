<template>
  <div class="tooltip-dialog">
    <slot name="content" />
    <div class="tooltip-dialog__popup">
      <slot name="tooltip-content"/>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TooltipDialog',
});
</script>

<style>
    .tooltip-dialog{
        position: relative;

        &__popup{
            visibility: hidden;
            width: 120px;
            background-color: black;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            top: 150%;
            left: 50%;
            margin-left: -60px;

             &::after {
                content: "";
                position: absolute;
                bottom: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: transparent transparent black transparent;
             }
        }
        &:hover &__popup {
          visibility: visible;
        }
    }
</style>
