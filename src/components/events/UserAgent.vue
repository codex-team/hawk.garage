<template>
  <DetailsBase>
    <template #header>
      USER-AGENT
    </template>
    <template #content>
      <div class="event-details__content-block">
        <div class="event-details__value">
          {{ value }}}
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import Vue from 'vue';
import DetailsBase from './DetailsBase.vue';

export default Vue.extend({
  name: 'UserAgent',
  components: {
    DetailsBase,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
});
</script>
