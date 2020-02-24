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
            class="details-addons__json-viewer"
            :value="value"
            theme="json-viewer-theme"
          />
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import DetailsBase from './DetailsBase.vue';
import JsonViewer from 'vue-json-viewer';

@Component({
  components: {
    DetailsBase,
    JsonViewer,
  },
})

/**
 * Details addons component
 */
export default class DetailsAddons extends Vue {
  @Prop(Object) addons!: object;
}
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
