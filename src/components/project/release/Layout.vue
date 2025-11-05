<template>
  <PopupDialog
    big
    @close="close"
  >
    <div>
      <div class="release-layout__header">
        <div class="breadcrumbs">
          <!-- <router-link :to="{ name: 'project-overview', params: { projectId } }">
            {{ project?.name || $t("projects.placeholder") }}
          </router-link> -->
          <span class="breadcrumbs__sep">/</span>
          <!-- <span>{{ release }}</span> -->
        </div>
        <!-- <div
          class="release-layout__title"
          :title="release"
        >
          {{ release }}
        </div> -->
        <TabBar
          :items="tabs"
          :active-item-index="activeTabIndex"
        />
      </div>
      <div  v-if="dataLoaded"  class="release-layout__content">
        <router-view :release-details="releaseDetails" />
      </div>
    </div>
  </PopupDialog>
</template>

<script>
import TabBar from '@/components/utils/TabBar.vue';
import PopupDialog from '@/components/utils/PopupDialog.vue';
import { fetchProjectReleaseDetails } from '@/api/projects';

export default {
  name: 'ReleaseLayout',
  components: {
    TabBar,
    PopupDialog
  },
  data() {
    return {
      releaseDetails: {
        events: [],
        files: [],
        commits: [],
      },
      dataLoaded: false,
    };
  },
  computed: {
    projectId() {
      return this.$route.params.projectId;
    },
    release() {
      return this.$route.params.release;
    },
    project() {
      return this.$store.getters.getProjectById(this.projectId);
    },
    tabs() {
      return [
        { title: this.$t('projects.tabs.events'),
          routeName: 'project-release-events' },
        {
          title: this.$t('projects.releases.stats.files'),
          routeName: 'project-release-files',
        },
        {
          title: this.$t('projects.releases.stats.commits'),
          routeName: 'project-release-commits',
        },
      ];
    },
    activeTabIndex() {
      const map = {
        'project-release-events': 0,
        'project-release-files': 1,
        'project-release-commits': 2,
      };

      return map[this.$route.name] ?? 0;
    },
  },
  async created() {
    const details = await fetchProjectReleaseDetails(this.projectId, this.release);
    console.log('Loaded details:', details);
    this.releaseDetails = {
      events: details?.events || [],
      files: details?.files || [],
      commits: details?.commits || [],
    };
    console.log('Set releaseDetails:', this.releaseDetails);
    await this.$nextTick();
    this.dataLoaded = true;
    console.log('dataLoaded set to true');
  },
  methods: {
    close() {
      this.$router.push({
        name: 'project-releases',
        params: { projectId: this.projectId },
      });
    },
  },
};
</script>

<style>
.release-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.release-layout__content {
  margin: 0 auto;
  max-width: var(--width-event-center-container);
}
.release-layout__header {
  padding-inline: var(--layout-padding-inline);
  border-bottom: 1px solid var(--color-bg-second);
}
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-second);
  font-size: 12px;
  padding-top: 8px;
}
.breadcrumbs a {
  color: var(--color-text-second);
}
.breadcrumbs__sep {
  color: var(--color-text-second);
}
.release-layout__title {
  padding: 8px 0 6px;
  padding-inline: 0;
  color: var(--color-text-main);
  font-weight: 700;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.release-layout__content {
  padding: 12px var(--layout-padding-inline);
}
</style>
