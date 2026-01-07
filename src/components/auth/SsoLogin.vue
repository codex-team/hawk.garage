<template>
  <div class="auth-page">
    <FormComponent
      ref="form"
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
      :message="message"
      @form-submit="initiateSso"
    >
      <template #heading>
        <h2 class="auth-form__header">
          {{ t('authPages.ssoLogin.title') }}
        </h2>
      </template>
      <template #before-fields>
        <div
          v-if="workspaceIdFromUrl"
          class="auth-form__workspace-info-section"
        >
          <div
            v-if="workspaceName"
            class="auth-form__workspace-info"
          >
            <EntityImage
              :id="(workspaceId as string)"
              :name="workspaceName"
              :image="workspaceImage || undefined"
              :size="36"
            />
            {{ workspaceName }}
          </div>
        </div>
      </template>
      <template #after-action>
        <router-link
          to="/login"
          class="auth-page__sso-link"
        >
          {{ t('authPages.ssoLogin.backToLogin') }}
        </router-link>
      </template>
    </FormComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import FormComponent from './Form.vue';
import EntityImage from '../utils/EntityImage.vue';
import { SET_TOKENS } from '../../store/modules/user/actionTypes';
import { getCookie, removeCookie } from '../../utils';
import { API_ENDPOINT } from '../../api';
import { getSsoWorkspace } from '../../api/workspaces';
import notifier from 'codex-notifier';

const route = useRoute();
const router = useRouter();
const store = useStore();
const { t } = useI18n();

/**
 * Workspace ID from URL parameters or empty string if not provided
 */
const workspaceId = ref(route.params.workspaceId || '');

/**
 * Workspace name loaded from API
 * Null if not loaded or failed to load
 */
const workspaceName = ref<string | null>(null);

/**
 * Workspace image/logo URL loaded from API
 * Null if not loaded, failed to load, or workspace has no image
 */
const workspaceImage = ref<string | null>(null);

/**
 * Loading state for workspace info fetch
 * True while fetching workspace information from API
 */
const isLoadingWorkspace = ref(false);

/**
 * Whether workspace ID is provided in URL parameters
 * Used to determine if we should show workspace ID input field
 */
const workspaceIdFromUrl = computed(() => {
  return !!route.params.workspaceId;
});

/**
 * Form fields configuration
 * Empty array if workspace ID is in URL (no need to input it)
 * Otherwise contains single field for workspace ID input
 */
const fields = computed(() => {
  return workspaceIdFromUrl.value
    ? []
    : [
        {
          autoComplete: 'off',
          label: t('authPages.ssoLogin.workspaceId'),
          name: 'workspaceId',
          value: route.params.workspaceId || '',
          placeholder: t('authPages.ssoLogin.workspaceIdPlaceholder'),
          type: 'text',
        },
      ];
});

/**
 * Submit button text
 */
const submitText = computed(() => t('authPages.continueWithSso'));

/**
 * Form message (error, success, etc.)
 * Used to display messages to user in the form
 */
const message = ref<Record<string, any> | undefined>(undefined);

/**
 * Fetch workspace information by ID
 * This is optional - if request fails (e.g., no auth), we just show ID
 */
async function fetchWorkspaceInfo() {
  if (!workspaceIdFromUrl.value || !workspaceId.value) {
    return;
  }

  isLoadingWorkspace.value = true;

  try {
    /**
     * Get workspace public info using SSO public endpoint
     * This endpoint is available without authentication and returns
     * only basic info (id, name, image) if SSO is enabled
     */
    const response = await getSsoWorkspace(workspaceId.value as string);

    if (response.data?.ssoWorkspace) {
      const workspace = response.data.ssoWorkspace;

      workspaceName.value = workspace.name || null;
      workspaceImage.value = workspace.image || null;
    }
  } catch (e: unknown) {
    /**
     * If request fails (e.g., no auth token), just show ID
     * This is expected behavior on SSO login page
     */
    // eslint-disable-next-line no-console
    console.debug('Failed to fetch workspace info:', e);
  } finally {
    isLoadingWorkspace.value = false;
  }
}

/**
 * Handle SSO callback with tokens from query parameters
 * After SSO authentication, API redirects back with access_token and refresh_token
 */
onMounted(async () => {
  /**
   * Try to fetch workspace info first (optional)
   * If user is not logged in, it will fail gracefully
   */
  await fetchWorkspaceInfo();

  if (
    route.query.access_token
    && route.query.refresh_token
  ) {
    try {
      await store.dispatch(SET_TOKENS, {
        accessToken: route.query.access_token,
        refreshToken: route.query.refresh_token,
      });

      const afterAuthRedirect = getCookie('afterAuthRedirect');

      router.push(afterAuthRedirect || '/');

      removeCookie('afterAuthRedirect');
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);

      const errorMessage = e instanceof Error ? e.message : String(e);

      notifier.show({
        message: t(`authPages.errors.${errorMessage}`) || errorMessage,
        style: 'error',
      });
    }
  }
});

/**
 * Initiate SSO login flow
 * Redirects to API endpoint which will redirect to IdP
 */
function initiateSso() {
  /**
   * Get workspaceId from form field or route params
   */
  const currentWorkspaceId = workspaceIdFromUrl.value
    ? workspaceId.value
    : fields.value[0]?.value;

  if (!currentWorkspaceId) {
    notifier.show({
      message: t('authPages.ssoLogin.workspaceIdRequired'),
      style: 'error',
    });

    return;
  }

  const apiUrl = API_ENDPOINT || 'http://localhost:4000';
  const returnUrl = typeof route.query.returnUrl === 'string'
    ? route.query.returnUrl
    : `/workspace/${currentWorkspaceId}`;

  /**
   * Redirect to API endpoint
   * API will redirect to IdP SSO URL
   */
  window.location.href = `${apiUrl}/auth/sso/saml/${currentWorkspaceId}?returnUrl=${encodeURIComponent(returnUrl)}`;
}
</script>

<style src="../../styles/auth-page.css"></style>

<style scoped>
.auth-form {
  &__header {
    margin: 0;
    font-weight: 600;
    font-size: 20px;
  }

  &__workspace-info-section {
    margin-bottom: 20px;
  }

  &__workspace-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    color: var(--color-text-main);
    font-size: 18px;
    font-weight: 600;
  }
}

.auth-page {
  &__sso-link {
    color: var(--color-text-second);
    font-size: 13px;
    text-decoration: none;
    margin: 20px auto 0;
    text-align: center;
    display: block;

    &:hover {
      color: var(--color-text-main);
    }
  }
}
</style>
