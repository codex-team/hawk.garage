import ProjectsMenuItem from '@/components/aside/ProjectsMenuItem.vue';
import mdx from './docs.mdx';
import store from '@/store';
import { mutationTypes } from '@/store/modules/projects';
import router from '@/router';
import { text, withKnobs } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';

const projectId1 = '5e3eef0679fa3700a0198a49';
const projectId2 = '5e3eef0679fa3700a0198a50';

/**
 * @todo mock some events to add case with last event displayed
 */
store.commit(mutationTypes.ADD_PROJECT, {
  id: projectId1,
  name: 'TestProject',
  unreadCount: 10,
});

store.commit(mutationTypes.ADD_PROJECT, {
  id: projectId2,
  name: 'TestProject 2',
  unreadCount: 0,
});

router.push(`/projects/${projectId1}`);

export default {
  component: ProjectsMenuItem,
  title: 'Aside/Projects Menu Item',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 342px; max-height: 100%; padding: 20px 0; overflow-y: auto;"><story /></div>',
    }),
    centered,
    withKnobs,
  ],
};

export const Default = () => ({
  components: { ProjectsMenuItem },
  template: `<ProjectsMenuItem :projectId="projectId" :search-query="null" />`,
  props: {
    projectId: {
      type: String,
      default: projectId1,
    },
  },
  store,
  router,
});

export const NoUnreadEvents = () => ({
  components: { ProjectsMenuItem },
  template: `<ProjectsMenuItem :projectId="projectId" :search-query="null" />`,
  props: {
    projectId: {
      type: String,
      default: projectId2,
    },
  },
  store,
  router,
});

export const WithSearchQuery = () => ({
  components: { ProjectsMenuItem },
  template: `<ProjectsMenuItem :projectId="projectId" :search-query="searchQuery" />`,
  props: {
    projectId: {
      type: String,
      default: projectId2,
    },
    searchQuery: {
      type: String,
      default: text('Search query', '2'),
    },
  },
  store,
  router,
});

export const List = () => ({
  components: { ProjectsMenuItem },
  template: `
    <div>
        <ProjectsMenuItem
          v-for="id in projectIds"
          :projectId="id"
          :search-query="null"
        />
    </div>
  `,
  props: {
    projectIds: {
      type: String,
      default: new Array(10).fill(projectId1),
    },
  },
  store,
  router,
});

export const ListWithSearchQuery = () => ({
  components: { ProjectsMenuItem },
  template: `
    <div>
      <ProjectsMenuItem
        v-for="id in projectIds"
        :projectId="id"
        :search-query="searchQuery"
      />
    </div>
  `,
  props: {
    projectIds: {
      type: String,
      default: new Array(10).fill(projectId1),
    },
    searchQuery: {
      type: String,
      default: text('Search query', 'Test'),
    },
  },
  store,
  router,
});
