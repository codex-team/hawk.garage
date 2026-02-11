<template>
  <div class="auth-page">
    <FormComponent
      ref="form"
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
      :message="message"
      :alt-link="altLink"
      :alt-text="altText"
      :success-message="successMessage"
      :helper-text="isVisitedByInvite ? $t('authPages.inviteHelper') : null"
      @form-submit="login"
    >
      <template #after-action>
        <div class="auth-page__sso-section">
          <router-link
            to="/login/sso"
            class="auth-page__sso-link"
          >
            {{ $t('authPages.continueWithSso') }}
          </router-link>
        </div>
        <div class="auth-page__demo-section">
          <router-link
            to="/demo"
            class="auth-page__demo-button"
          >
            {{ $t('authPages.showDemo') }}
          </router-link>
        </div>
      </template>
    </FormComponent>
  </div>
</template>

<script>
import FormComponent from './Form';
import { LOGIN } from '../../store/modules/user/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';
import notifier from 'codex-notifier';
import { getCookie, removeCookie } from '../../utils';

export default {
  name: 'Login',
  components: {
    FormComponent,
  },
  mixins: [offlineErrorMessage],
  props: {
    /**
     * Success flag to determine which success message to show
     */
    success: {
      type: String,
      default: '',
    },

    /**
     * Email passed to prefill the field
     */
    emailPrefilled: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fields: [
        {
          autoComplete: 'email',
          label: this.$t('authPages.emailAddress'),
          name: 'email',
          value: this.emailPrefilled,
          placeholder: 'name@best-team.com',
          type: 'email',
        },
        {
          autoComplete: 'current-password',
          label: this.$t('authPages.password'),
          name: 'password',
          value: '',
          placeholder: '********',
          type: 'password',
        },
      ],
      altLink: '/recover',
      altText: this.$t('authPages.recoverPassword'),
      submitText: this.$t('authPages.loginSubmitText'),
      message: null,
    };
  },
  computed: {
    /**
     * Get success message based on success flag
     */
    successMessage() {
      if (this.success === 'signup') {
        return this.$t('authPages.signupSuccessMessage');
      }

      if (this.success === 'recover') {
        return this.$t('authPages.recoverPasswordSuccessMessage');
      }

      return '';
    },

    /**
     * True when user was redirected to login page by invite
     * Used to show Invite helper above the form
     */
    isVisitedByInvite() {
      return getCookie('afterAuthRedirect') !== '';
    },
  },
  async mounted() {
    /**
     * OAuth code
     * It is not used at the moment
     * See https://github.com/codex-team/hawk.garage/pull/101
     */
    // if (
    //   this.$route.query.access_token
    //   && this.$route.query.refresh_token
    // ) {
    //   try {
    //     await this.$store.dispatch(SET_TOKENS, {
    //       accessToken: this.$route.query.access_token,
    //       refreshToken: this.$route.query.refresh_token,
    //     });

    //     const afterAuthRedirect = getCookie('afterAuthRedirect');

    //     this.$router.push(afterAuthRedirect || '/');

    //     removeCookie('afterAuthRedirect');
    //   } catch (e) {
    //     notifier.show({
    //       message: this.$t(`authPages.errors.${e.message}`),
    //       style: 'error',
    //     });
    //   }
    // }

    /**
     * If email is prefilled, set focus to the password
     */
    if (this.emailPrefilled) {
      this.$refs.form.$el.querySelector('input[name="password"]').focus();
    }
  },
  methods: {
    /**
     * Form submit event handler
     */
    async login() {
      const email = this.fields[0].value;
      const password = this.fields[1].value;

      try {
        await this.$store.dispatch(LOGIN, {
          email,
          password,
        });

        const afterAuthRedirect = getCookie('afterAuthRedirect');

        this.$router.push(afterAuthRedirect || '/');

        removeCookie('afterAuthRedirect');
      } catch (e) {
        console.error(e);

        let errorMessage = this.$t(`authPages.errors.${e.message}`);

        /**
         * Handle SSO enforcement error with workspace name
         */
        if (e.message === 'SSO_REQUIRED' && e.extensions?.workspaceName) {
          const workspaceId = e.extensions.workspaceId;
          const workspaceName = e.extensions.workspaceName;
          const ssoLink = `/login/sso/${workspaceId}`;

          errorMessage = this.$t('authPages.errors.SSO_REQUIRED', {
            workspace: workspaceName,
            link: ssoLink,
          });
        }

        notifier.show({
          message: errorMessage,
          style: 'error',
        });
      }
    },
  },
};
</script>

<style src="../../styles/auth-page.css"></style>

<style scoped>
.auth-page {
  &__sso-section {
    margin-top: 20px;
    text-align: center;
  }

  &__sso-link {
    color: var(--color-text-second);
    font-size: 13px;
    text-decoration: none;

    &:hover {
      color: var(--color-text-main);
    }
  }

  &__demo-section {
    margin-top: 15px;
    text-align: center;
  }

  &__demo-button {
    display: inline-block;
    background: transparent;
    border: 1px solid var(--color-bg-main);
    color: var(--color-text-second);
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-bg-main);
      color: var(--color-text-main);
      border-color: var(--color-border-main);
    }
  }
}
</style>
