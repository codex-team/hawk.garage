<template>
  <div class="page">
    <Form
      :title="title"
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
import Form from '../components/Form';
import { AUTH_REQUEST } from '../store/actions/auth';
import { offlineErrorMessage } from '../mixins/offlineErrorMessage';

export default {
  name: 'Login',
  mixins: [ offlineErrorMessage ],
  data() {
    return {
      title: 'Log in',
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
      submitText: 'Enter',
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
        await this.$store.dispatch(AUTH_REQUEST, { email, password });
        this.$router.push('/');
      } catch (e) {
        this.message = {
          text: 'Error while sending request to the server',
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

<style>
  @import "../styles/page.css";
</style>
