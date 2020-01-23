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
          <JsonViewer
            class="details-addon__json-viewer"
            :value="value"
            theme="json-viewer-theme"
          />
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script>
import DetailsBase from './DetailsBase';
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'DetailsAddons',
  components: {
    DetailsBase,
    JsonViewer
  },
  props: {
    addons: {
      type: Object,
      required: true
    }
  }
};
</script>

<style>
  .details-addons {
    .event-details__value {
      width: 100%;
    }

    &__json-viewer {
      width: 100%;
    }
  }
</style>
