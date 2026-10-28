<template>
  <span
    v-if="status"
    class="event-release-status"
    :class="`event-release-status--${status.type}`"
    :title="$t(`event.releaseStatus.${status.type}`, { release: status.release })"
  >
    {{ $t(`event.releaseStatus.${status.type}`, { release: status.release }) }}
  </span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { HawkEvent } from '@/types/events';

type EventReleaseState = Pick<HawkEvent, 'firstSeenInRelease' | 'resolvedInRelease' | 'regressionInRelease'>;

export default defineComponent({
  name: 'EventReleaseStatus',
  props: {
    event: {
      type: Object as PropType<EventReleaseState>,
      required: true,
    },
  },
  computed: {
    /**
     * A regression supersedes the previous resolution; release names are opaque.
     */
    status(): { type: 'firstSeen' | 'resolved' | 'regression';
      release: string; } | null {
      if (this.event.regressionInRelease) {
        return { type: 'regression',
          release: this.event.regressionInRelease };
      }

      if (this.event.resolvedInRelease) {
        return { type: 'resolved',
          release: this.event.resolvedInRelease };
      }

      if (this.event.firstSeenInRelease) {
        return { type: 'firstSeen',
          release: this.event.firstSeenInRelease };
      }

      return null;
    },
  },
});
</script>

<style scoped>
.event-release-status {
  display: inline-block;
  min-width: 0;
  max-width: 100%;
  padding: 3px 6px;
  overflow: hidden;
  font-size: 11px;
  font-weight: 500;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  background-color: var(--color-bg-main);
  border-radius: 5px;

  &--firstSeen {
    color: var(--color-text-highlighted);
  }

  &--resolved {
    color: var(--color-indicator-positive);
  }

  &--regression {
    color: var(--color-indicator-warning);
  }
}
</style>
