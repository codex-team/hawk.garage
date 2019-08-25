<template>
  <div class="auth-page">
    <Form
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
      :message="message"
      :alt-link="altLink"
      :alt-text="altText"
      @submit="login"
    />
  </div>
</template>

<script>
import Form from './Form';
import { LOGIN } from '../../store/modules/auth/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';

export default {
  name: 'Login',
  components: {
    Form
  },
  mixins: [ offlineErrorMessage ],
  data() {
    return {
      fields: [
        {
          label: this.$t('emailAddress'),
          name: 'email',
          value: '',
          placeholder: 'name@best-team.com',
          type: 'email'
        },
        {
          label: this.$t('password'),
          name: 'password',
          value: '',
          placeholder: '********',
          type: 'password'
        }
      ],
      altLink: '/reset',
      altText: this.$t('recoverPassword'),
      submitText: this.$t('loginSubmitText'),
      message: null
    };
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
        this.$router.push('/');
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

<i18n src="./translations.json"></i18n>
