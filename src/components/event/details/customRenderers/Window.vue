<template>
  <span class="window-dimensions">
    {{ value.innerWidth }} × {{ value.innerHeight }}
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { WindowData } from '@hawk.so/types';

export default defineComponent({
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

<style scoped>
.window-dimensions {
  white-space: nowrap;
}
</style>
