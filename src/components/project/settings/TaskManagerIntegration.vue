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
            @click="disconnectGitHub"
          />
        </div>

        <!-- Connected Repository Info (shown when repository is selected) -->
        <Section
          v-else
          class="task-manager-integration-settings-page__connected-info"
        >
          <Control
            :label="connectedRepoFullName"
            :icon-left="connectedRepoIcon"
            icon-right="external"
            :is-first="true"
            :is-last="!(isAdmin && connectedRepoFullName)"
            :is-only="!(isAdmin && connectedRepoFullName)"
            @click="openRepository"
          />
          <Control
            v-if="isAdmin && connectedRepoFullName"
            :label="t('projects.settings.taskManager.githubRepository.disconnectButton')"
            class="task-manager-integration-settings-page__connected-info-disconnect"
            :is-last="true"
            @click="disconnectGitHub"
          />
        </Section>
      </div>
    </section>

    <!-- Auto Task Creation Section -->
    <Section
      v-if="isConnected && connectedRepoFullName"
      :title="t('projects.settings.taskManager.autoTaskCreation.title')"
      :description="t('projects.settings.taskManager.autoTaskCreation.thresholdDescription')"
    >
      <form
        class="task-manager-integration-settings-page__form"
        @submit.prevent
      >
        <Control
          :label="t('projects.settings.taskManager.autoTaskCreation.enableLabel')"
          :is-first="true"
          :is-only="!formAutoTaskEnabled"
          @click="handleEnableLabelClick"
        >
          <UiSwitch
            ref="enableSwitchRef"
            v-model="formAutoTaskEnabled"
            @update:model-value="onAutoTaskEnabledChange"
          />
        </Control>
        <Control
          v-if="formAutoTaskEnabled"
          :label="t('projects.settings.taskManager.autoTaskCreation.thresholdLabel')"
          label-for="threshold-input"
          :is-last="true"
        >
          <input
            id="threshold-input"
            v-model.number="formThreshold"
            type="number"
            min="1"
            max="10000000"
            step="1"
            class="task-manager-integration-settings-page__control-input"
            placeholder="50"
            @keydown="handleNumberInputKeydown"
            @input="handleThresholdInput"
            @blur="handleThresholdInput"
          >
        </Control>
      </form>
    </Section>
    <div
      v-if="showSubmitButton"
      class="task-manager-integration-settings-page__submit-area"
    >
      <UiButton
        :content="t('common.save')"
        submit
        @click="saveAutoTaskSettings"
      />
    </div>

    <!-- Agent Assignment Section -->
    <Section
      v-if="isConnected && connectedRepoFullName && formAutoTaskEnabled"
      :title="t('projects.settings.taskManager.agent.title')"
      :description="t('projects.settings.taskManager.agent.description')"
      class="task-manager-integration-settings-page__agent-section"
    >
      <Control
        :label="t('projects.settings.taskManager.agent.controlLabel')"
        :is-only="true"
        @click="handleAssignAgentLabelClick"
      >
        <UiSwitch
          ref="assignAgentSwitchRef"
          v-model="formAssignAgent"
          @update:model-value="onAssignAgentChange"
        />
      </Control>
    </Section>
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
import Section from '../../forms/Section.vue';
import Control from '../../forms/Control.vue';
import { ActionType } from '../../utils/ConfirmationWindow/types';
import notifier from 'codex-notifier';
import { API_ENDPOINT } from '../../../api';
import { DISCONNECT_TASK_MANAGER, UPDATE_GITHUB_REPOSITORY, FETCH_GITHUB_REPOSITORIES, UPDATE_TASK_MANAGER_SETTINGS } from '@/store/modules/projects/actionTypes';

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
   * Enable auto task creation
   */
  autoTaskEnabled?: boolean;

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
 * Form data for auto task enabled
 */
const formAutoTaskEnabled = ref<boolean>(props.project.taskManager?.autoTaskEnabled || false);

/**
 * Form data for assign agent
 */
const formAssignAgent = ref<boolean>(props.project.taskManager?.assignAgent || false);

/**
 * Refs for switch components to handle label clicks
 */
const enableSwitchRef = ref<InstanceType<typeof UiSwitch> | null>(null);
const assignAgentSwitchRef = ref<InstanceType<typeof UiSwitch> | null>(null);

/**
 * Original values from project for comparison
 */
const originalThreshold = ref<number>(props.project.taskManager?.taskThresholdTotalCount || 10);
const originalAutoTaskEnabled = ref<boolean>(props.project.taskManager?.autoTaskEnabled || false);

/**
 * Button will be shown only when threshold is changed
 * Note: auto task enabled state changes are saved automatically via onAutoTaskEnabledChange
 */
const showSubmitButton = computed(() => {
  /**
   * Show button only if threshold changed and auto task creation is enabled
   * Don't show button for auto task enabled state changes (they are saved automatically)
   */
  return formAutoTaskEnabled.value && formThreshold.value !== originalThreshold.value;
});

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
      formAutoTaskEnabled.value = props.project.taskManager.autoTaskEnabled || false;
      formAssignAgent.value = props.project.taskManager.assignAgent || false;
    }
    /**
     * Update original values after successful save
     */
    originalThreshold.value = formThreshold.value;
    originalAutoTaskEnabled.value = formAutoTaskEnabled.value;
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
    /**
     * Validate threshold value before saving
     */
    if (formThreshold.value < 1) {
      formThreshold.value = 1;
    }

    if (formThreshold.value > 10000000) {
      formThreshold.value = 10000000;
    }

    const payload: UpdateTaskManagerSettingsPayload = {
      projectId: props.project.id,
      autoTaskEnabled: formAutoTaskEnabled.value,
      taskThresholdTotalCount: formThreshold.value,
      assignAgent: formAssignAgent.value,
    };

    await store.dispatch(UPDATE_TASK_MANAGER_SETTINGS, payload);

    /**
     * Update original values after successful save
     */
    originalThreshold.value = formThreshold.value;
    originalAutoTaskEnabled.value = formAutoTaskEnabled.value;

    notifier.show({
      message: t('common.settingsUpdated'),
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
      autoTaskEnabled: formAutoTaskEnabled.value,
      taskThresholdTotalCount: formThreshold.value,
      assignAgent: formAssignAgent.value,
    };

    await store.dispatch(UPDATE_TASK_MANAGER_SETTINGS, payload);

    notifier.show({
      message: t('common.settingsUpdated'),
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
 * Handle number input keydown to allow only numbers
 *
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleNumberInputKeydown(e: KeyboardEvent): void {
  /**
   * Allow: backspace, delete, tab, escape, enter
   * Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
   * Allow: home, end, left, right arrow keys
   */
  if (
    [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1
    || (e.keyCode === 65 && e.ctrlKey === true)
    || (e.keyCode === 67 && e.ctrlKey === true)
    || (e.keyCode === 86 && e.ctrlKey === true)
    || (e.keyCode === 88 && e.ctrlKey === true)
    || (e.keyCode === 90 && e.ctrlKey === true)
    || (e.keyCode >= 35 && e.keyCode <= 39)
  ) {
    return;
  }

  /**
   * Ensure that it is a number and stop the keypress
   */
  if (
    (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57))
    && (e.keyCode < 96 || e.keyCode > 105)
  ) {
    e.preventDefault();
  }
}

/**
 * Handle number input change to validate minimum and maximum value
 */
function handleThresholdInput(): void {
  /**
   * Ensure value is at least 1
   * Handle case when value is 0, null, undefined, or empty string
   */
  if (!formThreshold.value || formThreshold.value < 1 || isNaN(formThreshold.value)) {
    formThreshold.value = 1;
  }

  /**
   * Ensure value is not more than 10 million
   */
  if (formThreshold.value > 10000000) {
    formThreshold.value = 10000000;
  }
}

/**
 * Handle click on enable label to toggle switch
 */
function handleEnableLabelClick(): void {
  if (enableSwitchRef.value) {
    /**
     * Toggle switch by calling its click method
     */
    const switchElement = enableSwitchRef.value.$el as HTMLElement;

    if (switchElement) {
      switchElement.click();
    }
  }
}

/**
 * Handle click on assign agent label to toggle switch
 */
function handleAssignAgentLabelClick(): void {
  if (assignAgentSwitchRef.value) {
    /**
     * Toggle switch by calling its click method
     */
    const switchElement = assignAgentSwitchRef.value.$el as HTMLElement;

    if (switchElement) {
      switchElement.click();
    }
  }
}

/**
 * Handle auto task enabled switch change
 */
async function onAutoTaskEnabledChange(): Promise<void> {
  try {
    await saveAutoTaskSettings();
    /**
     * Update original value after successful save
     */
    originalAutoTaskEnabled.value = formAutoTaskEnabled.value;
  } catch (error) {
    /**
     * If save failed, revert the switch state
     */
    formAutoTaskEnabled.value = originalAutoTaskEnabled.value;
    throw error;
  }
}
</script>

<style src="../../../styles/settings-window-page.css"></style>

<style>
  .task-manager-integration-settings-page {
    max-width: var(--width-popup-form-container);

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
      padding: 8px 12px;
      color: #fff !important;
      border-radius: 6px;

      .ui-button-icon {
        width: 16px;
        height: 16px;
      }

      .ui-button-text  {
        font-weight: normal !important;
        white-space: nowrap;
        margin-left: 6px;
      }
    }

    &__connected-section {
      margin-top: 20px;
    }

    &__connected-info {
      color: var(--color-text-main);
      font-size: 14px;

      .form-control__icon--right {
        opacity: 0.6;
      }

      .form-control__icon--right,
      .form-control__icon--right .icon {
        width: 18px;
        height: 18px;
      }

      .form-control:hover {
        .form-control__icon--right {
          opacity: 1;
        }
      }

      &-disconnect label {
        color: var(--color-text-second);
      }
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
      margin-top: 0;
    }

    &__control-input {
      width: 100%;
      padding: 0;
      background-color: var(--color-bg-main);
      border: 0;
      border-radius: 6px;
      color: var(--color-text-main);
      font-size: 15px;
      text-align: right;
      appearance: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: textfield;

      /**
       * Hide spinner arrows in Chrome/Safari
       */
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &:focus {
        outline: none;
        border-color: var(--color-primary);
      }

      &::placeholder {
        color: var(--color-text-second);
      }
    }

    &__submit-area {
      margin-bottom: 40px;
    }

    &__switch-wrapper {
      margin-top: 20px;
    }

    &__agent-section {
      margin-top: 40px;
    }
  }

  .settings-window-page__subtitle {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }
</style>
