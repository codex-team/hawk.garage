<template>
  <DetailsBase>
    <template #header>
      {{ $t("event.release") }}
    </template>
    <template #content>
      <div
        v-for="item in releases"
        :key="item.label"
        class="event-details__content-block"
      >
        <div class="event-details__key">
          {{ $t(item.label) }}
        </div>
        <div class="event-details__value">
          <router-link
            :to="{ name: 'project-release', params: { projectId: $route.params.projectId, release: item.release } }"
            class="event-details__release-link"
            :title="item.release"
          >
            {{ item.release }}
          </router-link>
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DetailsBase from './DetailsBase.vue';

export default defineComponent({
  name: 'DetailsRelease',
  components: {
    DetailsBase,
  },
  props: {
    /**
     * Release value from event payload
     */
    release: {
      type: String,
      default: null,
    },
    firstSeenInRelease: {
      type: String,
      default: null,
    },
    resolvedInRelease: {
      type: String,
      default: null,
    },
    regressionInRelease: {
      type: String,
      default: null,
    },
  },
  computed: {
    /**
     * Keep the selected repetition's release when it differs from the first occurrence.
     */
    releases(): { label: string;
      release: string; }[] {
      return [
        { label: 'event.releaseDetails.firstSeen',
          release: this.firstSeenInRelease },
        { label: 'event.release',
          release: this.release !== this.firstSeenInRelease ? this.release : null },
        { label: 'event.releaseDetails.resolved',
          release: this.resolvedInRelease },
        { label: 'event.releaseDetails.regression',
          release: this.regressionInRelease },
      ].filter(item => Boolean(item.release));
    },
  },
});
</script>

<style>
.event-details__release-link {
  color: var(--color-text-main);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.event-details__release-link:hover {
  text-decoration: underline;
}
</style>
