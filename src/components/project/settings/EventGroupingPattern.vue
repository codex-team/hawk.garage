<template>
  <div class="projects-patterns-settings-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.patterns.title') }}
    </div>
    <div class="settings-window-page__subtle">
      {{ $t('projects.settings.patterns.description') }}
    </div>
    <div
      v-if="userCanEdit"
      class="section"
    >
      <div class="section__title">
        {{ $t('projects.settings.patterns.createPattern.title') }}
      </div>
      <input
        v-model="createPatternForm"
        class="input section__input"
        placeholder="Attempt to read property \".*\" on array"
      >
      <UiButton
        class="section__button"
        :content="$t('projects.settings.patterns.create')"
        submit
        @click="saveNewPattern(createPatternForm)"
      />
    </div>
    <div class="section">
      <div class="section__title">
        {{ $t('projects.settings.patterns.patternList.title') }}
      </div>
      <div class="pattern-list">
        <div
          v-for="(pattern) in currentPatternsState"
          :key="pattern.id"
        >
          <input
            v-model="pattern.pattern"
            class="input section__input"
            :disabled="!userCanEdit"
            :placeholder="$t('projects.settings.patterns.createPattern.placeholder')"
          >
        </div>
      </div>
      <UiButton
        v-if="userCanEdit"
        class="section__button"
        :content="$t('projects.settings.patterns.save')"
        submit
        @click="saveButtonClicked()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UiButton from '@/components/utils/UiButton.vue';
import FormTextFieldset from '../../forms/TextFieldset.vue';
import { ProjectEventGroupingPattern } from '@/types/project-event-grouping-patterns';
import { Project } from '@/types/project';
import { Workspace, ConfirmedMember, Member } from '@/types/workspaces';
import {
  ADD_EVENT_GROUPING_PATTERN,
  UPDATE_EVENT_GROUPING_PATTERN,
  REMOVE_EVENT_GROUPING_PATTERN } from '@/store/modules/projects/actionTypes';
import notifier from 'codex-notifier';

export default Vue.extend({
  name: 'ProjectSettingsPatterns',
  components: {
    UiButton,
  },
  props: {
    project: {
      type: Object as () => Project,
      required: true,
    },
  },
  data() {
    return {
      currentPatternsState: [] as ProjectEventGroupingPattern[],
      createPatternForm: '',
    };
  },
  computed: {
    workspace(): Workspace {
      return this.$store.getters.getWorkspaceByProjectId(this.project.id);
    },
    currentMembership(): Member | undefined {
      return this.$store.getters.getCurrentUserInWorkspace(this.workspace);
    },
    userCanEdit(): boolean {
      return this.currentMembership ? (this.currentMembership as ConfirmedMember).isAdmin : false;
    },
  },
  mounted(): void {
    this.updatePatternsState();
  },
  methods: {
    /**
     * Method that will save new pattern and update current pattern state
     *
     * @param pattern - pattern string to be saved
     */
    async saveNewPattern(pattern: string): Promise<void> {
      try {
        new RegExp(pattern);
      } catch (regexpError) {
        notifier.show({ message: 'Invalid regular expression pattern',
          style: 'error' });
        return;
      }

      try {
        await this.$store.dispatch(ADD_EVENT_GROUPING_PATTERN, { projectId: this.project.id,
          pattern });
        notifier.show({ message: 'Pattern added successfully',
          style: 'success' });
        this.createPatternForm = '';
      } catch (error) {
        notifier.show({ message: `Failed to add pattern`,
          style: 'error' });
      }

      this.updatePatternsState();
    },

    /**
     * Method that will update pattern by id and update current pattern state
     *
     * @param id - id of the existing pattern to be updated
     * @param pattern - new pattern string
     */
    async updatePattern(id: string, pattern: string): Promise<void> {
      /**
       * Check that the pattern is a valid regular expression
       */
      try {
        new RegExp(pattern);
      } catch (regexpError) {
        notifier.show({ message: 'Invalid regular expression pattern',
          style: 'error' });
        return;
      }

      try {
        await this.$store.dispatch(UPDATE_EVENT_GROUPING_PATTERN, { projectId: this.project.id,
          id,
          pattern });
        notifier.show({ message: 'Pattern updated',
          style: 'success' });
      } catch (error) {
        notifier.show({ message: `Failed to update pattern`,
          style: 'error' });
      }

      this.updatePatternsState();
    },

    /**
     * Method that will remove pattern by id
     *
     * @param id - id of the existing pattern to be removed
     * @param index - index of the pattern in the currentPatternsState list
     */
    async removePattern(id: string): Promise<void> {
      try {
        await this.$store.dispatch(REMOVE_EVENT_GROUPING_PATTERN, { projectId: this.project.id,
          id });
        notifier.show({ message: 'Pattern deleted',
          style: 'success' });
      } catch (error) {
        notifier.show({ message: 'Failed to delete pattern',
          style: 'error' });

        return;
      }

      this.updatePatternsState();
    },

    /**
     * This method is called, when save button is clicked and it determines, what patterns should be updated or removed
     */
    async saveButtonClicked(): Promise<void> {
      this.currentPatternsState.forEach((pattern) => {
        /**
         * If new pattern is empty, then we should remove it
         */
        if (pattern.pattern.trim() === '') {
          this.removePattern(pattern.id);

          return;
        }

        /**
         * Compare pattern string in the input and existing pattern string in project for same id
         * If they are different - then we should save or remove
         */
        if (pattern.pattern !== this.project.eventGroupingPatterns?.find((existingPattern) => {
          return existingPattern.id === pattern.id;
        })?.pattern) {
          console.log('update pattern clicked for pattern: ', pattern.pattern, pattern.id);
          this.updatePattern(pattern.id, pattern.pattern);
        }
      });
    },

    /**
     * Method that updates currentPatternsState list with patterns from project
     */
    updatePatternsState(): void {
      if (this.project?.eventGroupingPatterns) {
        this.currentPatternsState = this.project.eventGroupingPatterns.map((pattern) => {
          return {
            id: pattern.id,
            pattern: pattern.pattern,
          };
        });
      }
    },
  },
});
</script>

<style scoped>
@import url('../../../styles/custom-properties.css');

.projects-patterns-settings-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 75%;
}

.settings-window-page {
  &__title {
    margin-bottom: 5px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 18px;
  }

  &__subtle {
    width: 85%;
    color: var(--color-text-main);
    font-weight: 400;
    font-size: 13px;
    line-height: 19px;
    opacity: 0.6;
  }
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 14px 0 30px 0;

  &__title {
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.15px;
    text-transform: uppercase;
    opacity: 0.6;
  }

  &__input {
    padding: 9px 12px;
    font-weight: 400;
    font-size: 12px;
    font-family: var(--font-monospace);
    line-height: 17px;
  }

  &__button {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    max-width: 91px;
    padding: 10px 32px;
  }
}

.pattern-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

</style>@/types/project-event-grouping-patterns