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

    <div
      class="projects-integrations-settings-page__revoke-container"
      v-html="$t('projects.settings.integrations.revokeText')"
      @click="revokeIntegrationToken()"
    />
    <br>
    <br>
    <br>
    <div class="settings-window-page__title">
      {{ $t('projects.settings.integrations.sentryDSN') }}
    </div>
    <div>
      {{ $t('projects.settings.integrations.sentryDSNText') }}
    </div>
    <TokenBlock
      v-if="sentryDSN"
      class="projects-integrations-settings-page__token"
      :token="sentryDSN"
    />
    <p
      v-else
      style="color: var(--color-indicator-critical);"
    >
      {{ $t('projects.settings.integrations.sentryDSNTextNoToken') }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Project } from '../../../types/project';
import TokenBlock from '../TokenBlock.vue';
import { ActionType } from '../../utils/ConfirmationWindow/types';
import { GENERATE_NEW_INTEGRATION_TOKEN } from '@/store/modules/projects/actionTypes';
import notifier from 'codex-notifier';
import { getSentryDSN } from '../../../utils';

export default defineComponent({
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
  computed: {
    sentryDSN(): string {
      return getSentryDSN(this.project.token);
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
        },
      });
    },
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  .projects-integrations-settings-page {
    &__token {
      margin-top: 15px;
    }

    &__revoke-container {

      margin-top: 15px;
      color: var(--color-text-second);
      font-size: 14px;
      line-height: 20px;
    }

    &__revoke-button {
      display: inline-block;
      padding-bottom: 1px;
      line-height: 1em;
      border-bottom: 1px solid var(--color-text-second);

      cursor: pointer;
    }
  }
</style>
