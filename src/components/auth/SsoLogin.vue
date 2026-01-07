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
          <p class="auth-form__workspace-info">
            {{ t('authPages.ssoLogin.workspaceLabel') }}: <strong>{{ workspaceId }}</strong>
          </p>
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import FormComponent from './Form';
import { SET_TOKENS } from '../../store/modules/user/actionTypes';
import { getCookie, removeCookie } from '../../utils';
import { API_ENDPOINT } from '../../api';
import notifier from 'codex-notifier';

const route = useRoute();
const router = useRouter();
const store = useStore();
const { t } = useI18n();

const workspaceId = ref(route.params.workspaceId || '');

const workspaceIdFromUrl = computed(() => {
  return !!route.params.workspaceId;
});

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

const submitText = computed(() => t('authPages.continueWithSso'));
const message = ref(null);

/**
 * Handle SSO callback with tokens from query parameters
 * After SSO authentication, API redirects back with access_token and refresh_token
 */
onMounted(async () => {
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
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);

      notifier.show({
        message: t(`authPages.errors.${e.message}`) || e.message,
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
  const returnUrl = route.query.returnUrl || `/workspace/${currentWorkspaceId}`;

  /**
   * Redirect to API endpoint
   * API will redirect to IdP SSO URL
   */
  window.location.href = `${apiUrl}/auth/sso/saml/${currentWorkspaceId}?returnUrl=${encodeURIComponent(returnUrl)}`;
}
</script>

<style src="../../styles/auth-page.css"></style>

<style scoped>
.auth-form__header {
  margin: 0;
  font-weight: 800;
  font-size: 27px;
}

.auth-form__workspace-info-section {
  margin-bottom: 20px;
}

.auth-form__workspace-info {
  margin: 0;
  color: var(--color-text-main);
  font-size: 16px;
}

.auth-page__sso-link {
  color: var(--color-text-second);
  font-size: 13px;
  text-decoration: none;
  margin: 20px auto 0;
  text-align: center;
  display: block;
}

.auth-page__sso-link:hover {
  color: var(--color-text-main);
}
</style>
