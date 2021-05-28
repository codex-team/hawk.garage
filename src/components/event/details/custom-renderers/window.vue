<template>
  <span>
    {{ value.innerWidth }} × {{ value.innerHeight }}
  </span>
</template>

<script lang="ts">
import Vue , { PropType } from 'vue';
import { WindowData } from 'hawk.types';

export default Vue.extend({
  props: {
    /**
     * Addon value
     */
    value: {
      type: Object as PropType<WindowData>,
      required: true
    }
  }
})
</script>
