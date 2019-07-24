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
          label: 'Email address',
          name: 'email',
          value: '',
          placeholder: 'name@best-team.com',
          type: 'email'
        },
        {
          label: 'Password',
          name: 'password',
          value: '',
          placeholder: '********',
          type: 'password'
        }
      ],
      altLink: '/reset',
      altText: 'Recover password',
      submitText: 'Login',
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
