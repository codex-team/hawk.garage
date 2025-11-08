<template>
  <div>
    <div class="settings-window-page__title">
      {{ $t('projects.settings.rateLimits.title') }}
    </div>
    <div class="project-settings__description">
      {{ $t('projects.settings.rateLimits.description') }}
    </div>
    <RateLimitsForm
      :key="project.id"
      :value="project.rateLimitSettings"
      :disabled="!isRateLimitsAvailable"
      :max-threshold="maxThreshold"
      @submit="handleSubmit"
      @clear="handleClear"
    />
    <div
      v-if="!isRateLimitsAvailable"
      class="project-settings__paid-only-message"
    >
      {{ $t('projects.settings.rateLimits.paidOnlyMessage') }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RateLimitsForm from '../../forms/RateLimitsForm.vue';
import { Project, ProjectRateLimitSettings } from '../../../types/project';
import { UPDATE_PROJECT_RATE_LIMITS } from '@/store/modules/projects/actionTypes';
import notifier from 'codex-notifier';

export default defineComponent({
  name: 'RateLimits',
  components: {
    RateLimitsForm,
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
    /**
     * Check if rate limits feature is available
     * Available only for paid plans
     */
    isRateLimitsAvailable(): boolean {
      if (!this.project) {
        return false;
      }

      const workspace = this.$store.getters.getWorkspaceByProjectId(this.project.id);

      if (!workspace || !workspace.plan) {
        return false;
      }

      const isFree
        = workspace.plan.monthlyCharge === 0
          || workspace.plan.id === process.env.VUE_APP_FREE_PLAN_ID;

      return !isFree;
    },

    /**
     * Get workspace plan events limit
     */
    maxThreshold(): number {
      const workspace = this.$store.getters.getWorkspaceByProjectId(this.project.id);

      return workspace?.plan?.eventsLimit || 1000000000;
    },
  },
  methods: {
    /**
     * Handle form submit from RateLimitsForm component
     *
     * @param rateLimitSettings
     */
    async handleSubmit(rateLimitSettings: ProjectRateLimitSettings): Promise<void> {
      try {
        await this.$store.dispatch(UPDATE_PROJECT_RATE_LIMITS, {
          id: this.project.id,
          rateLimitSettings,
        });

        notifier.show({
          message: this.$t('projects.settings.rateLimits.updatedMessage') as string,
          style: 'success',
          time: 5000,
        });
      } catch (e) {
        const error = e as Error;

        notifier.show({
          message: error.message,
          style: 'error',
          time: 5000,
        });
      }
    },

    /**
     * Handle clear button click from RateLimitsForm component
     */
    async handleClear(): Promise<void> {
      try {
        await this.$store.dispatch(UPDATE_PROJECT_RATE_LIMITS, {
          id: this.project.id,
          rateLimitSettings: null,
        });

        notifier.show({
          message: this.$t('projects.settings.rateLimits.clearedMessage') as string,
          style: 'success',
          time: 5000,
        });
      } catch (e) {
        const error = e as Error;

        notifier.show({
          message: error.message,
          style: 'error',
          time: 5000,
        });
      }
    },
  },
});
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
.project-settings {
  width: 75%;

  &__form {
    display: flex;
    flex-wrap: wrap;
  }

  &__submit-area {
    flex-basis: 100%;
  }

  &__label {
    margin-bottom: 9px;
  }

  &__section {
    max-width: 280px;
  }

  &__description {
    width: 85%;
    margin-bottom: 20px;
    color: var(--color-text-main);
    font-weight: 400;
    font-size: 13px;
    line-height: 19px;
    opacity: 0.6;
  }

  &__paid-only-message {
    margin-bottom: 20px;
    color: var(--color-text-main);
    font-weight: 400;
    font-size: 13px;
    line-height: 19px;
    background-color: var(--color-bg-second);
    border-radius: 8px;
  }

  &__section,
  &__submit-button {
    margin: 0 0 20px 0;
  }

  &__stats {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: var(--color-bg-second);
    border-radius: 8px;
  }

  &__stat-label {
    margin-right: 10px;
    color: var(--color-text-second);
    font-size: 14px;
  }

  &__stat-value {
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
