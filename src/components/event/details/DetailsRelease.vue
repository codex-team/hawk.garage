<template>
  <DetailsBase>
    <template #header>
      {{ $t("event.release") }}
    </template>
    <template #content>
      <div class="event-details__content-block">
        <div class="event-details__key">
          {{ $t("event.release") }}
        </div>
        <div class="event-details__value">
          <router-link
            :to="releaseRoute"
            class="event-details__release-link"
            :title="release"
          >
            {{ release }}
          </router-link>
        </div>
      </div>
    </template>
  </DetailsBase>
</template>

<script lang="ts">
import Vue from 'vue';
import DetailsBase from './DetailsBase.vue';

export default Vue.extend({
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
      required: true,
    },
  },
  computed: {
    /**
     * Route to the release page inside current project
     */
    releaseRoute(): Record<string, unknown> {
      const projectId = (this as any).$route.params.projectId;
      const release = (this as any).release;

      return {
        name: 'project-release',
        params: {
          projectId,
          release,
        },
      };
    },
  },
});
</script>

<style>
.event-details__release-link {
  color: var(--color-text-main);
  text-decoration: none;
}

.event-details__release-link:hover {
  text-decoration: underline;
}
</style>


