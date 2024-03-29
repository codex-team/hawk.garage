<template>
  <div class="auth-page">
    <Form
      ref="form"
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
      :message="message"
      :alt-link="altLink"
      :alt-text="altText"
      :success-message="successMessage"
      @submit="login"
    />
  </div>
</template>

<script>
import Form from './Form';
import { LOGIN, SET_TOKENS } from '../../store/modules/user/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';
import notifier from 'codex-notifier';

export default {
  name: 'Login',
  components: {
    Form,
  },
  mixins: [ offlineErrorMessage ],
  props: {
    /**
     * Success message text
     */
    successMessage: {
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
  async mounted() {
    if (
      this.$route.query.access_token &&
      this.$route.query.refresh_token
    ) {
      try {
        await this.$store.dispatch(SET_TOKENS, {
          accessToken: this.$route.query.access_token,
          refreshToken: this.$route.query.refresh_token,
        });

        const afterAuthRedirect = this.$cookies.get('afterAuthRedirect');

        this.$router.push(afterAuthRedirect || '/');

        this.$cookies.remove('afterAuthRedirect');
      } catch (e) {
        notifier.show({
          message: this.$i18n.t(e.message),
          style: 'error',
        });
      }
    }

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

        const afterAuthRedirect = this.$cookies.get('afterAuthRedirect');

        this.$router.push(afterAuthRedirect || '/');

        this.$cookies.remove('afterAuthRedirect');
      } catch (e) {
        console.error(e);

        notifier.show({
          message: this.$i18n.t(`authPages.errors.${e.message}`),
          style: 'error',
        });
      }
    },
  },
};
</script>

<style src="../../styles/auth-page.css"></style>
