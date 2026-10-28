<template>
  <DetailsBase
    v-if="releases.length"
    class="event-release-details"
  >
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
import { isMeaningfulRelease } from '@/utils';

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
        { label: 'event.releaseDetails.occurrence',
          release: [this.firstSeenInRelease, this.resolvedInRelease, this.regressionInRelease].includes(this.release)
            ? null
            : this.release },
        { label: 'event.releaseDetails.resolved',
          release: this.resolvedInRelease },
        { label: 'event.releaseDetails.regression',
          release: this.regressionInRelease },
      ].filter(item => isMeaningfulRelease(item.release));
    },
  },
});
</script>

<style>
.event-release-details {
  .event-details__content-block {
    display: grid;
    grid-template-columns: minmax(0, 230px) minmax(0, 1fr);
    gap: 16px;
  }

  .event-details__key {
    min-width: 0;
    max-width: none;
  }
}

@media (max-width: 600px) {
  .event-release-details .event-details__content-block {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}

.event-details__release-link {
  color: var(--color-text-main);
  text-decoration: none;
  overflow-wrap: anywhere;
}

.event-details__release-link:hover {
  text-decoration: underline;
}
</style>
