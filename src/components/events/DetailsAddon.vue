<template>
  <DetailsBase class="details-addon">
    <template #header>
      ADDONS
    </template>
    <template #content>
      <div
        class="event-details__content-block"
        v-for="(value, key) in addons"
        :key="key"
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
  name: 'DetailsAddon',
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
  .details-addon {
    .event-details__value {
      width: 100%;
    }

    &__json-viewer {
      width: 100%;
    }
  }
</style>
