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
        v-if="addRuleOpened || ruleUnderEditing || (!rules || !rules.length)"
        :rule="ruleUnderEditing"
        :project-id="project.id"
        @cancel="closeForm"
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
        :enableEditing="userCanEdit"
        @editClicked="editRule"
      />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AddRule from './NotificationsAddRule.vue';
import Rule from './NotificationsRule.vue';
import { ProjectNotificationsRule, ReceiveTypes } from '@/types/project-notifications';
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
    rules: ProjectNotificationsRule[],
    addRuleOpened: boolean,
    ruleUnderEditingId?: string,
    } {
    return {
      rules: [
        {
          id: '123456',
          isEnabled: true,
          uidAdded: 'adaad',
          whatToReceive: ReceiveTypes.ONLY_NEW,
          including: ['codex', 'editor'],
          excluding: ['script error.', 'ожидание приянтия запроса пользователем на вступления в команду,', 'adad', 'adaddadad', 'daddadad'],
          channels: {
            slack: {
              isEnabled: true,
              endpoint: 'https://hooks.slack.com/services/T038Y…',
            },
            telegram: {
              isEnabled: true,
              endpoint: 'https://bot.codex.so/E2V87B3X3B44…',
            },
          },
        },
        {
          id: '213141',
          isEnabled: true,
          uidAdded: 'adaad',
          whatToReceive: ReceiveTypes.ONLY_NEW,
          channels: {
            email: {
              isEnabled: true,
              endpoint: 'alerts@codex.so',
            },
          },
        },
      ],
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
     * Return rule that is currently under editing
     */
    ruleUnderEditing(): ProjectNotificationsRule | undefined {
      if (!this.ruleUnderEditingId) {
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
  methods: {
    /**
     * User clicks on 'Edit Rule button'
     * @param {string} ruleId - id of rule to edit
     */
    editRule(ruleId: string): void {
      this.ruleUnderEditingId = ruleId;
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
