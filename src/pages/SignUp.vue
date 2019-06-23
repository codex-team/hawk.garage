<template>
  <div class="auth-page">
    <Form
      :fields="fields"
      :submitText="submitText"
      :message="message"
      @submit="signUp"
    >
    </Form>
  </div>
</template>

<script>
import Form from '../components/Form';
import { SIGN_UP } from '../store/actions/auth';
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
        await this.$store.dispatch(SIGN_UP, { email });
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

<style src="../styles/auth-page.css"></style>
