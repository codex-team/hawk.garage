<template>
  <span
    v-if="status"
    class="event-release-status"
    :class="`event-release-status--${status}`"
    :title="tooltip"
  >
    {{ $t(`event.releaseStatus.${status}`) }}
  </span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { HawkEvent } from '@/types/events';
import { isMeaningfulRelease } from '@/utils';

type EventReleaseState = Pick<HawkEvent, 'firstSeenInRelease' | 'resolvedInRelease' | 'regressionInRelease'>;

export default defineComponent({
  name: 'EventReleaseStatus',
  props: {
    latestRelease: {
      type: String,
      default: null,
    },
    event: {
      type: Object as PropType<EventReleaseState>,
      required: true,
    },
  },
  computed: {
    /**
     * A regression supersedes the previous resolution; release names are opaque.
     */
    status(): 'firstSeen' | 'resolved' | 'regression' | null {
      if (isMeaningfulRelease(this.event.regressionInRelease)) {
        return 'regression';
      }

      if (isMeaningfulRelease(this.event.resolvedInRelease)) {
        return 'resolved';
      }

      if (isMeaningfulRelease(this.event.firstSeenInRelease)
        && isMeaningfulRelease(this.latestRelease)
        && this.event.firstSeenInRelease === this.latestRelease) {
        return 'firstSeen';
      }

      return null;
    },
    /**
     * Explain the status and its release without expanding the visible badge.
     */
    tooltip(): string {
      switch (this.status) {
        case 'firstSeen':
          return this.$t('event.releaseStatusTooltip.firstSeen', { release: this.event.firstSeenInRelease });
        case 'resolved':
          return this.$t('event.releaseStatusTooltip.resolved', { release: this.event.resolvedInRelease });
        case 'regression':
          return this.$t('event.releaseStatusTooltip.regression', { release: this.event.regressionInRelease });
        default:
          return '';
      }
    },
  },
});
</script>

<style scoped>
.event-release-status {
  display: inline-block;
  min-width: 0;
  max-width: 100%;
  padding: 2px 9px;
  overflow: hidden;

  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  background-color: transparent;
  border: 1px solid currentColor;
  border-radius: 999px;
  cursor: help;

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
