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
        <!-- Repository Picker (shown when no repository is selected) -->
        <div
          v-if="!connectedRepoFullName"
          class="task-manager-integration-settings-page__repo-picker"
        >
          <CustomSelect
            v-if="repositories.length > 0"
            :options="repositoryOptions"
            :model-value="selectedRepository || undefined"
            :label="t('projects.settings.taskManager.githubRepository.selectRepositoryLabel')"
            :need-image="false"
            :placeholder="t('projects.settings.taskManager.githubRepository.selectRepositoryPlaceholder')"
            @update:model-value="onRepositorySelected"
          />
          <div
            v-else-if="isLoadingRepositories"
            class="task-manager-integration-settings-page__loading"
          >
            {{ t('projects.settings.taskManager.githubRepository.loadingRepositories') }}
          </div>
          <div
            v-else-if="repositoriesError"
            class="task-manager-integration-settings-page__error"
          >
            {{ repositoriesError }}
          </div>
          <UiButton
            v-if="isAdmin"
            class="task-manager-integration-settings-page__disconnect-button"
            :content="t('projects.settings.taskManager.githubRepository.disconnectButton')"
            rounded
            @click="disconnectGitHub"
          />
        </div>

        <!-- Connected Repository Info (shown when repository is selected) -->
        <div
          v-else
          class="task-manager-integration-settings-page__connected-info"
        >
          <UiButton
            class="task-manager-integration-settings-page__connected-repo-button"
            :content="connectedRepoFullName"
            :icon="connectedRepoIcon"
            rounded
            @click="openRepository"
          />
        </div>
        <UiButton
          v-if="isAdmin && connectedRepoFullName"
          class="task-manager-integration-settings-page__disconnect-button"
          :content="t('projects.settings.taskManager.githubRepository.disconnectButton')"
          rounded
          @click="disconnectGitHub"
        />
      </div>
    </section>

    <!-- Auto Task Creation Section -->
    <section
      v-if="isConnected && connectedRepoFullName"
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
      v-if="isConnected && connectedRepoFullName"
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
import CustomSelect from '../../forms/CustomSelect.vue';
import { ActionType } from '../../utils/ConfirmationWindow/types';
import notifier from 'codex-notifier';
import { API_ENDPOINT } from '../../../api';
import { DISCONNECT_TASK_MANAGER, UPDATE_GITHUB_REPOSITORY, FETCH_GITHUB_REPOSITORIES } from '@/store/modules/projects/actionTypes';

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
 * Repository interface for GitHub repositories
 */
interface Repository {
  /**
   * Repository ID
   */
  id: string;

  /**
   * Repository name (without owner)
   */
  name: string;

  /**
   * Repository full name (owner/repo)
   */
  fullName: string;

  /**
   * Whether repository is private
   */
  private: boolean;

  /**
   * Repository HTML URL
   */
  htmlUrl: string;

  /**
   * Last update date
   */
  updatedAt: string;

  /**
   * Primary programming language
   */
  language: string | null;
}

/**
 * Repository list for selection
 */
const repositories = ref<Repository[]>([]);

/**
 * Loading state for repositories
 */
const isLoadingRepositories = ref<boolean>(false);

/**
 * Error message for repository loading
 */
const repositoriesError = ref<string | null>(null);

/**
 * Selected repository
 */
interface SelectedRepository {
  id: string;
  name: string;
}

const selectedRepository = ref<SelectedRepository | null>(null);

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
 * Connected repository ID
 */
const connectedRepoId = computed<string>(() => {
  const repoId = props.project.taskManager?.config.repoId;

  return repoId ? String(repoId) : '';
});

/**
 * Find connected repository from loaded repositories list
 */
const connectedRepository = computed<Repository | null>(() => {
  if (!connectedRepoId.value || repositories.value.length === 0) {
    return null;
  }

  return repositories.value.find((repo: Repository) => repo.id === connectedRepoId.value) || null;
});

/**
 * Icon for connected repository (language icon or GitHub fallback)
 */
const connectedRepoIcon = computed<string>(() => {
  if (connectedRepository.value) {
    return getLanguageIcon(connectedRepository.value.language);
  }

  return 'github';
});

/**
 * URL for connected repository
 */
const connectedRepoUrl = computed<string>(() => {
  if (connectedRepository.value) {
    return connectedRepository.value.htmlUrl;
  }

  /**
   * Fallback: construct URL from repoFullName if we don't have htmlUrl
   */
  if (connectedRepoFullName.value) {
    return `https://github.com/${connectedRepoFullName.value}`;
  }

  return '';
});

/**
 * Mapping of programming languages to icon names
 * Falls back to 'github' if language is not found
 */
const LANGUAGE_ICON_MAP: Record<string, string> = {
  Vue: 'vue',
  JavaScript: 'nodejs',
  TypeScript: 'nodejs',
  Python: 'python',
  PHP: 'php',
  Django: 'django',
  Flask: 'flask',
  FastAPI: 'fastapi',
  Nuxt: 'nuxt',
};

/**
 * Get icon name for language
 *
 * @param language - programming language name
 * @returns icon name or 'github' as fallback
 */
function getLanguageIcon(language: string | null): string {
  if (!language) {
    return 'github';
  }

  return LANGUAGE_ICON_MAP[language] || 'github';
}

/**
 * Repository options for CustomSelect
 */
const repositoryOptions = computed(() => {
  return repositories.value.map((repo: Repository) => {
    return {
      id: repo.id,
      name: repo.fullName,
      icon: getLanguageIcon(repo.language),
    };
  });
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
 * Load repositories from API
 */
async function loadRepositories(): Promise<void> {
  if (!isConnected.value) {
    /**
     * Don't load if not connected
     */
    return;
  }

  /**
   * If repositories are already loaded, don't reload
   */
  if (repositories.value.length > 0) {
    return;
  }

  isLoadingRepositories.value = true;
  repositoriesError.value = null;

  try {
    const repos = await store.dispatch(FETCH_GITHUB_REPOSITORIES, {
      projectId: props.project.id,
    });

    repositories.value = repos || [];
  } catch (error) {
    console.error('Error loading repositories:', error);

    repositoriesError.value = error instanceof Error ? error.message : String(error);
  } finally {
    isLoadingRepositories.value = false;
  }
}

/**
 * Open connected repository in new tab
 */
function openRepository(): void {
  if (connectedRepoUrl.value) {
    window.open(connectedRepoUrl.value, '_blank');
  }
}

/**
 * Handle repository selection
 *
 * @param repository - selected repository object
 * @param repository.id - repository ID
 * @param repository.name - repository name
 */
async function onRepositorySelected(repository: SelectedRepository): Promise<void> {
  if (!repository) {
    return;
  }

  /**
   * Find full repository data
   */
  const fullRepo = repositories.value.find((r: Repository) => {
    return r.id === repository.id;
  });

  if (!fullRepo) {
    notifier.show({
      message: t('projects.settings.taskManager.githubRepository.repositoryNotFound'),
      style: 'error',
      time: 5000,
    });

    return;
  }

  try {
    await store.dispatch(UPDATE_GITHUB_REPOSITORY, {
      projectId: props.project.id,
      repoId: fullRepo.id,
      repoFullName: fullRepo.fullName,
    });

    selectedRepository.value = repository;

    notifier.show({
      message: t('projects.settings.taskManager.githubRepository.repositorySelected'),
      style: 'success',
      time: 5000,
    });
  } catch (error) {
    console.error('Error updating repository selection:', error);

    notifier.show({
      message: error instanceof Error ? error.message : String(error),
      style: 'error',
      time: 5000,
    });
  }
}

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
     * Load repositories after successful connection
     */
    loadRepositories();
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
  } else if (isConnected.value) {
    /**
     * Load repositories if connected (needed for repository info even if already selected)
     */
    loadRepositories();
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
     * The endpoint will return JSON with redirectUrl
     */
    const apiUrl = API_ENDPOINT || 'http://localhost:4000';
    const connectUrl = `${apiUrl}/integration/github/connect?projectId=${props.project.id}`;

    const response = await fetch(connectUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.redirectUrl) {
      /**
       * Redirect to GitHub installation page
       */
      window.location.href = data.redirectUrl;

      return;
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

    &__repo-picker {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
      width: 270px;
    }

    &__loading {
      color: var(--color-text-second);
      font-size: 14px;
    }

    &__error {
      color: var(--color-error);
      font-size: 14px;
    }

    &__disconnect-button {
      align-self: flex-start;
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
