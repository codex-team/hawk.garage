<template>
  <div class="projects-integrations-settings-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.integrations.title') }}
    </div>
    <div>
      {{ $t('projects.settings.integrations.projectTokenLabel') }} <b>{{ project.name }}</b>:
    </div>
    <TokenBlock
      class="projects-integrations-settings-page__token"
      :token="project.token"
    />
    <div class="projects-integrations-settings-page__revoke-container">
      {{ $t('projects.settings.integrations.revokeText.0') }}
      <span
        class="projects-integrations-settings-page__revoke-button"
        @click="revokeIntegrationToken()"
      >
        {{ $t('projects.settings.integrations.revoke') }}
      </span>
      {{ $t('projects.settings.integrations.revokeText.1') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Project} from '../../../types/project';
import TokenBlock from '../TokenBlock.vue';
import {ActionType} from "../../utils/ConfirmationWindow/types";
import {GENERATE_NEW_INTEGRATION_TOKEN} from '@/store/modules/projects/actionTypes';
import notifier from "codex-notifier";

export default Vue.extend({
  name: 'ProjectIntegrationsSettings',
  components: {
    TokenBlock,
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
  methods: {
    /**
     * Revokes integration token with confirmation
     */
    revokeIntegrationToken(): void {
      this.$confirm.open({
        title: this.$t('projects.settings.integrations.revokeConfirmation.title') as string,
        description: this.$t('projects.settings.integrations.revokeConfirmation.description') as string,
        actionType: ActionType.SUBMIT,
        onConfirm: async () => {
          try {
            await this.$store.dispatch(GENERATE_NEW_INTEGRATION_TOKEN, { projectId: this.project.id });
          } catch (e) {
            console.error(e);

            notifier.show({
              message: this.$t(e.message) as string,
              style: 'error',
            });
          }
        }
      });
    }
  }
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  .projects-integrations-settings-page {
    &__token {
      margin-top: 15px;
    }

    &__revoke-container {
      color: var(--color-text-second);
      font-size: 14px;
      line-height: 20px;

      margin-top: 15px;
    }

    &__revoke-button {
      display: inline-block;
      border-bottom: 1px solid var(--color-text-second);

      cursor: pointer;
    }
  }
</style>
