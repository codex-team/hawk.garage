<template>
  <div class="modal-form">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.notifications.title') }}
    </div>

    <section
      v-if="userCanEdit"
      class="modal-form__section"
    >
      <div class="modal-form__section-title">
        {{ $t('projects.settings.notifications.addRule') }}
      </div>
      <AddRule
        v-if="addRuleOpened"
        :rule="ruleUnderEditing"
        :project-id="project.id"
        @cancel="closeForm"
        @success="closeForm"
      />
      <UiButton
        v-else
        :content="$t('projects.settings.notifications.addRuleToggler')"
        submit
        @click="addRuleOpened = true"
      />
    </section>

    <section class="modal-form__section">
      <div class="modal-form__section-title">
        {{ $t('projects.settings.notifications.rulesList') }}
      </div>
      <Rule
        v-for="rule in rules"
        :key="rule.id"
        :rule="rule"
        :project-id="project.id"
        :enable-editing="userCanEdit"
        @editClicked="editRule"
        @removeClicked="removeRule"
      />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddRule from './NotificationsAddRule.vue';
import Rule from './NotificationsRule.vue';
import { ProjectNotificationsRule } from '@/types/project-notifications';
import UiButton from '@/components/utils/UiButton.vue';
import { Project } from '@/types/project';
import { Member, Workspace, ConfirmedMember } from '@/types/workspaces';

export default Vue.extend({
  name: 'ProjectSettingsNotifications',
  components: {
    AddRule,
    UiButton,
    Rule,
  },
  props: {
    /**
     * The project we are working with
     */
    project: {
      type: Object as () => Project,
      required: true,
    },
  },
  data(): {
    addRuleOpened: boolean,
    ruleUnderEditingId?: string,
    } {
    return {
      /**
       * Flag indicates Add Rule form opening state
       */
      addRuleOpened: false,

      /**
       * There will be stored id of a rule that user selected to edit
       */
      ruleUnderEditingId: undefined,
    };
  },
  computed: {
    /**
     * Sorted list created rules
     */
    rules(): ProjectNotificationsRule[] {
      if (!this.project || !this.project.notifications) {
        return [];
      }

      return this.project.notifications;
    },

    /**
     * Return rule that is currently under editing
     */
    ruleUnderEditing(): ProjectNotificationsRule | undefined {
      if (!this.ruleUnderEditingId) {
        return undefined;
      }

      if (!this.rules) {
        return undefined;
      }

      return this.rules.find((rule) => rule.id === this.ruleUnderEditingId);
    },

    /**
     * Return a workspace of a project
     */
    workspace(): Workspace {
      return this.$store.getters.getWorkspaceByProjectId(this.project.id);
    },

    /**
     * Current user in current workspace
     */
    currentMembership(): Member | undefined {
      return this.$store.getters.getCurrentUserInWorkspace(this.workspace);
    },

    /**
     * Is current user can manipulate rules
     */
    userCanEdit(): boolean {
      if (!this.currentMembership) {
        return false;
      }

      return (this.currentMembership as ConfirmedMember).isAdmin;
    },
  },
  mounted(): void {
    /**
     * If no one rules added, open add-rule form
     */
    if (!this.rules || this.rules.length === 0) {
      this.addRuleOpened = true;
    }
  },
  methods: {
    /**
     * User clicks on 'Edit Rule button'
     *
     * @param {string} ruleId - id of rule to edit
     */
    editRule(ruleId: string): void {
      this.ruleUnderEditingId = ruleId;
      this.addRuleOpened = true;
    },

    removeRule(ruleId: string): void {
      this.$store.dispatch('REMOVE_NOTIFICATIONS_RULE', {
        projectId: this.project.id,
        ruleId,
      });

      this.$forceUpdate();
    },

    /**
     * Close and clear add rule form
     */
    closeForm(): void {
      this.addRuleOpened = false;
      this.ruleUnderEditingId = undefined;
    },
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  @import url('../../../styles/custom-properties.css');

  .modal-form {
    &__section {
      margin-bottom: 50px;

      &-title {
        @apply --ui-label;
        margin-bottom: 15px;

        & + .n-rule {
          padding-top: 0;
        }
      }
    }
  }
</style>
