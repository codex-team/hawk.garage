<template>
  <nobr>
    {{ value.innerWidth }} × {{ value.innerHeight }}
  </nobr>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { WindowData } from '@hawk.so/types';

export default Vue.extend({
  props: {
    /**
     * Addon value
     */
    value: {
      type: Object as PropType<WindowData>,
      required: true,
    },
  },
});
</script>
