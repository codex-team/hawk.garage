<template>
  <PopupDialog
    big
    @close="close"
  >
    <div>
      <div class="release-layout__header">
        <div class="event-layout__container">
        <span
          v-if="releaseDetails.timestamp"
          class="release-layout__date"
        >
          {{ releaseDetails.timestamp / 1000| prettyFullDate }}
        </span>
        <SkeletonBar
          v-else
          class="release-layout__date"
          size="small"
          width="140px"
        />
        <div
          v-if="releaseDetails.timestamp"
          class="breadcrumbs"
        >
          <router-link
            v-if="workspace"
            class="breadcrumbs__item"
            :to="{ name: 'workspace', params: { workspaceId: workspace.id } }"
          >
            <EntityImage
              :id="workspace.id"
              :image="workspace.image"
              :name="workspace.name"
              size="16"
            />
            {{ workspace.name }}
          </router-link>
          <router-link
            v-if="project"
            class="breadcrumbs__item"
            :to="{ name: 'project-overview', params: { projectId } }"
          >
            <EntityImage
              :id="project.id"
              :image="project.image"
              :name="project.name"
              size="16"
            />
            {{ nameWithoutBadges(project.name) || $t('projects.placeholder') }}
            <ProjectBadge
              v-for="(badge, index) in projectBadges(project.name)"
              :key="index"
            >
              {{ badge }}
            </ProjectBadge>
          </router-link>
        </div>
        <div
          v-else
          class="breadcrumbs"
        >
          <div class="breadcrumbs__item">
            <SkeletonAvatar size="xxs" />
            <SkeletonBar size="small" width="120px" />
          </div>
          <div class="breadcrumbs__item">
            <SkeletonAvatar size="xxs" />
            <SkeletonBar size="small" width="160px" />
          </div>
        </div>
        <div
          v-if="releaseDetails.timestamp"
          class="release-layout__title"
          :title="release"
        >
          {{ release }}
        </div>
        <div
          v-else
          class="release-layout__title release-layout__title--skeleton"
        >
          <SkeletonBar size="large" width="300px" />
        </div>
        </div>
        <TabBar
          class="release-layout__tab-bar"
          :items="tabs"
          :active-item-index="activeTabIndex"
        />
      </div>
      <div v-if="releaseDetails.timestamp" class="release-layout__content">
        <router-view :release-details="releaseDetails" />
      </div>
      <div v-else class="release-layout__content release-layout__content--spinner">
        <Spinner size="medium" width="100%" />
      </div>
    </div>
  </PopupDialog>
</template>

<script lang="ts">
import TabBar from '@/components/utils/TabBar.vue';
import PopupDialog from '@/components/utils/PopupDialog.vue';
import { fetchProjectReleaseDetails } from '@/api/projects';
import EntityImage from '@/components/utils/EntityImage.vue';
import ProjectBadge from '@/components/project/ProjectBadge.vue';
import { projectBadges } from '@/mixins/projectBadges';
import SkeletonBar from '@/components/utils/SkeletonBar.vue';
import SkeletonAvatar from '@/components/utils/SkeletonAvatar.vue';
import Spinner from '@/components/utils/Spinner.vue';
import { ReleaseDetails } from '@/types/release';

export default {
  name: 'ReleaseLayout',
  components: {
    TabBar,
    PopupDialog,
    EntityImage,
    ProjectBadge,
    SkeletonBar,
    SkeletonAvatar,
    Spinner,
  },
  mixins: [ projectBadges ],
  data(): {
    releaseDetails: ReleaseDetails;
    dataLoaded: boolean;
  } {
    return {
      releaseDetails: {
        timestamp: 0,
        dailyEventsPortion: {
          dailyEvents: [],
        },
        files: [],
        commits: [],
        commitsCount: 0,
        filesCount: 0,
        release: '',
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
    workspace() {
      return this.$store.getters.getWorkspaceByProjectId(this.projectId);
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
    this.releaseDetails = {
      timestamp: details?.timestamp || null,
      dailyEventsPortion: details?.dailyEventsPortion || { dailyEvents: [] },
      files: details?.files || [],
      commits: details?.commits || [],
    };

    await this.$nextTick();
    this.dataLoaded = true;
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
  padding: 25px 30px;
}
.release-layout__header {
  padding: 35px 20px 0 20px;
  color: var(--color-text-second);
  background-color: #121419;
  margin: 0 auto;
}

.release-layout__header .event-layout__container {
  margin: 0 auto;
  max-width: var(--width-event-center-container);
}

.breadcrumbs {
  display: flex;
  margin-bottom: 22px;
  font-weight: 500;
  color: var(--color-text-second);
  font-size: 14px;
}
.breadcrumbs a {
  color: var(--color-text-second);
}
.breadcrumbs__item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.breadcrumbs__item:not(:last-of-type)::after {
  margin: 0 10px;
  content: '/';
}
.breadcrumbs__item .entity-image {
  margin-right: 10px;
}
.breadcrumbs__sep {
  color: var(--color-text-second);
}
.release-layout__title {
  padding: 6px 0 16px;
  padding-inline: 0;
  color: var(--color-text-main);
  font-weight: 700;
  font-size: 18px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &--skeleton {
    height: 34px;
  }
}

.release-layout__tab-bar {
  margin: 0 auto;
  max-width: var(--width-event-center-container);
}
.release-layout__date {
  float: right;
  font-size: 12px;
  line-height: 23px;
}

.release-layout__tab-bar--skeleton {
  padding-bottom: 24px;
}

.release-layout__content--spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 25px auto;
}

</style>
