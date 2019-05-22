<template>
  <div class="auth-page">
    <Form
      :fields="fields"
      :submitText="submitText"
      :message="message"
      :altLink="altLink"
      :altText="altText"
      @submit="signUp"
    >
    </Form>
  </div>
</template>

<script>
import Form from '../components/Form';
import { SIGN_UP_REQUEST } from '../store/actions/auth';
import { offlineErrorMessage } from '../mixins/offlineErrorMessage';

export default {
  mixins: [ offlineErrorMessage ],
  data() {
    return {
      fields: [
        {
          label: 'EMAIL ADDRESS',
          name: 'email',
          value: '',
          placeholder: 'name@best-team.com',
          type: 'email'
        }
      ],
      altLink: '/reset',
      altText: 'Recover password',
      submitText: 'Register',
      message: null
    };
  },
  methods: {
    /**
     * Form submit event handler
     */
    async signUp() {
      const email = this.fields[0].value;

      try {
        await this.$store.dispatch(SIGN_UP_REQUEST, { email });
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
  @import "../styles/auth-page.css";
</style>
