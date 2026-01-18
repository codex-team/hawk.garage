<template>
  <div class="task-manager-integration-settings-page">
    <div class="settings-window-page__title">
      {{ t('projects.settings.taskManager.title') }}
    </div>

    <!-- GitHub Repository Connection Section -->
    <section class="task-manager-integration-settings-page__section">
      <div class="settings-window-page__subtitle">
        {{ t('projects.settings.taskManager.githubRepository.title') }}
      </div>
      <div class="task-manager-integration-settings-page__description">
        {{ t('projects.settings.taskManager.githubRepository.description') }}
      </div>

      <div
        v-if="!isConnected"
        class="task-manager-integration-settings-page__connect-section"
      >
        <UiButton
          class="task-manager-integration-settings-page__connect-button"
          :content="t('projects.settings.taskManager.githubRepository.connectButton')"
          icon="github"
          submit
          rounded
          @click="connectGitHub"
        />
      </div>

      <div
        v-else
        class="task-manager-integration-settings-page__connected-section"
      >
        <div class="task-manager-integration-settings-page__connected-info">
          {{ t('projects.settings.taskManager.githubRepository.connectedTo') }}
          <b>{{ connectedRepoFullName }}</b>
        </div>
        <UiButton
          v-if="isAdmin"
          :content="t('projects.settings.taskManager.githubRepository.disconnectButton')"
          warning
          @click="disconnectGitHub"
        />
      </div>
    </section>

    <!-- Auto Task Creation Section -->
    <section
      v-if="isConnected"
      class="task-manager-integration-settings-page__section"
    >
      <div class="settings-window-page__subtitle">
        {{ t('projects.settings.taskManager.autoTaskCreation.title') }}
      </div>
      <div class="task-manager-integration-settings-page__description">
        {{ t('projects.settings.taskManager.autoTaskCreation.description') }}
      </div>
      <form
        class="task-manager-integration-settings-page__form"
        @submit.prevent
      >
        <div class="task-manager-integration-settings-page__field">
          <label class="label">
            {{ t('projects.settings.taskManager.autoTaskCreation.thresholdLabel') }}
          </label>
          <input
            v-model.number="formThreshold"
            type="number"
            min="1"
            class="input"
            :placeholder="t('projects.settings.taskManager.autoTaskCreation.thresholdPlaceholder')"
            @input="showSubmitButton = true"
          >
          <div class="task-manager-integration-settings-page__field-description">
            {{ t('projects.settings.taskManager.autoTaskCreation.thresholdDescription') }}
          </div>
        </div>
        <div
          v-if="showSubmitButton"
          class="task-manager-integration-settings-page__submit-area"
        >
          <UiButton
            :content="t('projects.settings.taskManager.autoTaskCreation.submit')"
            submit
            @click="saveAutoTaskSettings"
          />
        </div>
      </form>
    </section>

    <!-- Agent Assignment Section -->
    <section
      v-if="isConnected"
      class="task-manager-integration-settings-page__section"
    >
      <div class="settings-window-page__subtitle">
        {{ t('projects.settings.taskManager.agent.title') }}
      </div>
      <div class="task-manager-integration-settings-page__description">
        {{ t('projects.settings.taskManager.agent.description') }}
      </div>
      <div class="task-manager-integration-settings-page__switch-wrapper">
        <UiSwitch
          v-model="formAssignAgent"
          @update:model-value="onAssignAgentChange"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import type { Project } from '../../../types/project';
import UiSwitch from '../../forms/UiSwitch.vue';
import UiButton from '../../utils/UiButton.vue';
import { ActionType } from '../../utils/ConfirmationWindow/types';
import notifier from 'codex-notifier';
import { API_ENDPOINT } from '../../../api';
import { DISCONNECT_TASK_MANAGER } from '@/store/modules/projects/actionTypes';

/**
 * This data will be sent to update task manager settings
 */
interface UpdateTaskManagerSettingsPayload {
  /**
   * Project ID
   */
  projectId: string;

  /**
   * Threshold for auto task creation
   */
  taskThresholdTotalCount?: number;

  /**
   * Assign agent to tasks
   */
  assignAgent?: boolean;
}

/**
 * Props for the component
 */
interface Props {
  /**
   * The project we are working with
   */
  project: Project;
}

const props = defineProps<Props>();

const store = useStore();
const { t } = useI18n();
const instance = getCurrentInstance();

/**
 * Form data for threshold
 */
const formThreshold = ref<number>(props.project.taskManager?.taskThresholdTotalCount || 10);

/**
 * Form data for assign agent
 */
const formAssignAgent = ref<boolean>(props.project.taskManager?.assignAgent || false);

/**
 * Button will be shown only when some fields are changed
 */
const showSubmitButton = ref<boolean>(false);

/**
 * Is GitHub repository connected
 */
const isConnected = computed<boolean>(() => {
  return !!props.project.taskManager;
});

/**
 * Connected repository full name
 */
const connectedRepoFullName = computed<string>(() => {
  return props.project.taskManager?.config.repoFullName || '';
});

/**
 * Is user admin in workspace with this project
 */
const isAdmin = computed<boolean>(() => {
  const workspace = store.getters.getWorkspaceByProjectId(props.project.id);

  return workspace ? store.getters.isCurrentUserAdmin(workspace.id) : false;
});

/**
 * Watch for project changes to update form data
 */
watch(
  () => props.project.taskManager,
  () => {
    if (props.project.taskManager) {
      formThreshold.value = props.project.taskManager.taskThresholdTotalCount || 10;
      formAssignAgent.value = props.project.taskManager.assignAgent || false;
    }
    showSubmitButton.value = false;
  },
  { deep: true }
);

/**
 * Check for success/error query parameters after GitHub callback
 */
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const error = urlParams.get('error');

  if (success === 'true') {
    notifier.show({
      message: t('projects.settings.taskManager.githubRepository.connectSuccess'),
      style: 'success',
      time: 5000,
    });

    /**
     * Remove query parameters from URL
     */
    window.history.replaceState({}, '', window.location.pathname);

    /**
     * Reload page to get updated project data
     * TODO: Replace with GraphQL query to fetch updated project when API is ready
     */
    window.location.reload();
  } else if (error) {
    notifier.show({
      message: error,
      style: 'error',
      time: 10000,
    });

    /**
     * Remove query parameters from URL
     */
    window.history.replaceState({}, '', window.location.pathname);
  }
});

/**
 * Connect GitHub repository
 */
async function connectGitHub(): Promise<void> {
  /**
   * Get access token from store
   */
  const accessToken = store.state.user.accessToken;

  if (!accessToken) {
    notifier.show({
      message: t('projects.settings.taskManager.githubRepository.authError'),
      style: 'error',
      time: 5000,
    });

    return;
  }

  try {
    /**
     * Make request to API endpoint with Authorization header
     * The endpoint will return a redirect URL or handle the redirect itself
     */
    const apiUrl = API_ENDPOINT || 'http://localhost:4000';
    const connectUrl = `${apiUrl}/integration/github/connect?projectId=${props.project.id}`;

    /**
     * Use fetch to make request with Authorization header
     * The API should return a redirect response (302) or a URL to redirect to
     */
    const response = await fetch(connectUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      redirect: 'manual', // Don't follow redirect automatically
    });

    /**
     * If response is a redirect, follow it
     */
    if (response.status === 302 || response.status === 301) {
      const redirectUrl = response.headers.get('Location');

      if (redirectUrl) {
        window.location.href = redirectUrl;

        return;
      }
    }

    /**
     * If response is OK, try to get redirect URL from response
     */
    if (response.ok) {
      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;

        return;
      }
    }

    /**
     * If no redirect URL found, show error
     */
    notifier.show({
      message: t('projects.settings.taskManager.githubRepository.authError'),
      style: 'error',
      time: 5000,
    });
  } catch (error) {
    console.error('Error connecting to GitHub:', error);

    notifier.show({
      message: t('projects.settings.taskManager.githubRepository.authError'),
      style: 'error',
      time: 5000,
    });
  }
}

/**
 * Disconnect GitHub repository
 */
function disconnectGitHub(): void {
  if (!instance?.appContext.config.globalProperties.$confirm) {
    return;
  }

  instance.appContext.config.globalProperties.$confirm.open({
    title: t('projects.settings.taskManager.githubRepository.disconnectConfirmation.title'),
    description: t('projects.settings.taskManager.githubRepository.disconnectConfirmation.description'),
    actionType: ActionType.SUBMIT,
    onConfirm: async () => {
      try {
        await store.dispatch(DISCONNECT_TASK_MANAGER, { projectId: props.project.id });

        notifier.show({
          message: t('projects.settings.taskManager.githubRepository.disconnectSuccess'),
          style: 'success',
          time: 5000,
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        console.error(err);

        notifier.show({
          message: err.message || t('projects.settings.taskManager.githubRepository.disconnectError'),
          style: 'error',
          time: 5000,
        });
      }
    },
  });
}

/**
 * Save auto task creation settings
 */
async function saveAutoTaskSettings(): Promise<void> {
  try {
    const payload: UpdateTaskManagerSettingsPayload = {
      projectId: props.project.id,
      taskThresholdTotalCount: formThreshold.value,
    };

    /**
     * TODO: Call GraphQL mutation updateTaskManagerSettings
     * This will be implemented in phase 2 (API)
     */
    console.log('Saving auto task settings:', payload);

    showSubmitButton.value = false;

    notifier.show({
      message: t('projects.settings.taskManager.autoTaskCreation.updatedMessage'),
      style: 'success',
      time: 5000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    notifier.show({
      message,
      style: 'error',
      time: 5000,
    });
  }
}

/**
 * Handle assign agent switch change
 */
async function onAssignAgentChange(): Promise<void> {
  try {
    const payload: UpdateTaskManagerSettingsPayload = {
      projectId: props.project.id,
      assignAgent: formAssignAgent.value,
    };

    /**
     * TODO: Call GraphQL mutation updateTaskManagerSettings
     * This will be implemented in phase 2 (API)
     */
    console.log('Saving assign agent setting:', payload);

    notifier.show({
      message: t('projects.settings.taskManager.agent.updatedMessage'),
      style: 'success',
      time: 5000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    notifier.show({
      message,
      style: 'error',
      time: 5000,
    });
  }
}
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  .task-manager-integration-settings-page {
    &__section {
      margin-bottom: 40px;
    }

    &__description {
      margin-top: 8px;
      margin-bottom: 20px;
      color: var(--color-text-second);
      font-size: 14px;
      line-height: 20px;
    }

    &__connect-section {
      margin-top: 20px;
    }

    &__connect-button {
      padding: 10px 16px;
      background-color: #000;
      color: #fff !important;

      .ui-button-icon {
        width: 20px;
        height: 20px;
      }

      .ui-button-text  {
        font-weight: normal !important;
        white-space: nowrap;
        margin-left: 6px;
      }

      &:hover {
        background-color: #111 !important;
      }
    }

    &__connected-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 20px;
    }

    &__connected-info {
      color: var(--color-text-main);
      font-size: 14px;
    }

    &__form {
      margin-top: 20px;
    }

    &__field {
      margin-bottom: 20px;
    }

    &__field-description {
      margin-top: 8px;
      color: var(--color-text-second);
      font-size: 13px;
      line-height: 18px;
    }

    &__submit-area {
      margin-top: 20px;
    }

    &__switch-wrapper {
      margin-top: 20px;
    }
  }

  .settings-window-page__subtitle {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }
</style>
