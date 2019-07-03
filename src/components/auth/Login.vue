<template>
  <div class="auth-page">
    <Form
      class="auth-page__form"
      :fields="fields"
      :submitText="submitText"
      :message="message"
      :altLink="altLink"
      :altText="altText"
      @submit="login"
    >
    </Form>
  </div>
</template>

<script>
import Form from '../Form';
import { LOGIN } from '../../store/actions/auth';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';

export default {
  name: 'Login',
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
  },
  components: {
    Form
  }
};
</script>

<style src="../../styles/auth-page.css"></style>
