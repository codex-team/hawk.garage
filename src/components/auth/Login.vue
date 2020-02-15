<template>
  <div class="auth-page">
    <Form
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
      :message="message"
      :alt-link="altLink"
      :alt-text="altText"
      :is-password-recover-success="isPasswordRecoverSuccess"
      @submit="login"
    />
  </div>
</template>

<script>
import Form from './Form';
import { LOGIN, SET_TOKENS } from '../../store/modules/user/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';

export default {
  name: 'Login',
  components: {
    Form
  },
  mixins: [ offlineErrorMessage ],
  props: {
    isPasswordRecoverSuccess: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fields: [
        {
          label: this.$t('authPages.emailAddress'),
          name: 'email',
          value: '',
          placeholder: 'name@best-team.com',
          type: 'email'
        },
        {
          label: this.$t('authPages.password'),
          name: 'password',
          value: '',
          placeholder: '********',
          type: 'password'
        }
      ],
      altLink: '/recover',
      altText: this.$t('authPages.recoverPassword'),
      submitText: this.$t('authPages.loginSubmitText'),
      message: null
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
          refreshToken: this.$route.query.refresh_token
        });

        const afterAuthRedirect = this.$cookies.get('afterAuthRedirect');

        this.$router.push(afterAuthRedirect || '/');

        this.$cookies.remove('afterAuthRedirect');
      } catch (e) {
        this.message = {
          text: e.message,
          type: 'error'
        };
      }
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
        await this.$store.dispatch(LOGIN, { email, password });

        const afterAuthRedirect = this.$cookies.get('afterAuthRedirect');

        this.$router.push(afterAuthRedirect || '/');

        this.$cookies.remove('afterAuthRedirect');
      } catch (e) {
        this.message = {
          text: e.message,
          type: 'error'
        };
      }
    }
  }
};
</script>

<style src="../../styles/auth-page.css"></style>
