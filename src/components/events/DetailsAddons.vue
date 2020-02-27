<template>
  <DetailsBase class="details-addons">
    <template #header>
      ADDONS
    </template>
    <template #content>
      <div
        v-for="(value, key) in addons"
        :key="key"
        class="event-details__content-block"
      >
        <div class="event-details__key">
          {{ key }}
        </div>
        <div class="event-details__value">
          {{ value }}
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import Vue from 'vue';
import DetailsBase from './DetailsBase.vue';

/**
 * Details addons component
 */
export default Vue.extend({
  name: 'DetailsAddons',
  components: {
    DetailsBase,
  },
  props: {
    addons: {
      type: Object,
      required: true,
    },
  },
});
</script>
