<template>
  <div class="patterns">
    <div class="patterns__title">
      {{ $t('projects.settings.patterns.title') }}
    </div>
    <div class="patterns__description">
      {{ $t('projects.settings.patterns.description') }}
    </div>
    <div
      v-if="userCanEdit"
      class="patterns-section"
    >
      <div class="patterns-section__title">
        {{ $t('projects.settings.patterns.createPattern.title') }}
      </div>
      <input
        v-model="createPatternForm"
        class="input patterns-section__input"
        :placeholder='"Attempt to read property \".*\" on array"'
      >
      <UiButton
        class="patterns-section__button"
        :content="$t('projects.settings.patterns.create')"
        submit
        @click="saveNewPattern(createPatternForm)"
      />
    </div>
    <div class="patterns-section">
      <div class="patterns-section__title">
        {{ $t('projects.settings.patterns.patternList.title') }}
      </div>
      <div 
        class="patterns-section__empty-message"
        v-if="currentPatternsState.length === 0"
      >
        {{ $t('projects.settings.patterns.patternList.emptyMessage') }}
      </div>
      <div v-else class="patterns-list">
        <div
          v-for="(pattern) in currentPatternsState"
          :key="pattern.id"
          class="patterns-list__item"
        >
          <input
            v-model="pattern.pattern"
            class="input patterns-section__input"
            :disabled="!userCanEdit"
            :placeholder='"Attempt to read property \".*\" on array"'
          >
        </div>
      </div>
      <UiButton
        v-if="userCanEdit && currentPatternsState.length > 0"
        class="patterns-section__button"
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
import safe from 'safe-regex';

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
      /**
       * Check that the pattern is a valid regular expression
       */
      if (!this.isRegexValid(pattern)) {
        notifier.show({ message: this.$t('projects.settings.patterns.notifications.patternInvalid').toString(),
          style: 'error' });

        return;
      }

      try {
        await this.$store.dispatch(ADD_EVENT_GROUPING_PATTERN, { projectId: this.project.id,
          pattern });
        notifier.show({ message: this.$t('projects.settings.patterns.notifications.patternAdded').toString(),
          style: 'success' });
        this.createPatternForm = '';
      } catch (error) {
        console.error('Error while adding pattern', error);

        notifier.show({ message: this.$t('projects.settings.patterns.notifications.patternSaveError').toString(),
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
      if (!this.isRegexValid(pattern)) {
        notifier.show({ message: this.$t('projects.settings.patterns.notifications.patternInvalid').toString(),
          style: 'error' });

        return;
      }

      try {
        await this.$store.dispatch(UPDATE_EVENT_GROUPING_PATTERN, { projectId: this.project.id,
          id,
          pattern });
        notifier.show({ message: this.$t('projects.settings.patterns.notifications.patternUpdated').toString(),
          style: 'success' });
      } catch (error) {
        console.error('Error while updating pattern', error);

        notifier.show({ message: this.$t('projects.settings.patterns.notifications.patternUpdateError').toString(),
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
        notifier.show({ message: this.$t('projects.settings.patterns.notifications.patternDeleted').toString(),
          style: 'success' });
      } catch (error) {
        console.error('Error while deleting pattern', error);

        notifier.show({ message: this.$t('projects.settings.patterns.notifications.patternDeleteError').toString(),
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

    /**
     * Method that checks if the pattern is a valid regular expression
     *
     * @param pattern - pattern string to be checked
     * @returns true if the pattern is a valid regular expression, false otherwise
     */
    isRegexValid(pattern: string): boolean {
      try {
        if (pattern.trim() === '') {
          return false;
        }
        new RegExp(pattern);
        return safe(pattern);
      } catch (error) {
        return false;
      }
    },
  },
});
</script>

<style scoped>
@import url('../../../styles/custom-properties.css');

.patterns {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 75%;

  &__title {
    margin-bottom: 5px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 18px;
  }

  &__description {
    width: 85%;
    color: var(--color-text-main);
    font-weight: 400;
    font-size: 13px;
    line-height: 19px;
    opacity: 0.6;
  }
}

.patterns-section {
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

  &__empty-message {
    color: var(--color-text-main);
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    opacity: 0.6;
  }
}

.patterns-list {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__item {
    width: 100%;
  }
}
</style>