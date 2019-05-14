<template>
  <div class="page">
    <Form
      :title="title"
      :fields="fields"
      :submitText="submitText"
      :message="message"
      @submit="signUp"
    >
      <template #disclaimer>Already have an account?
        <router-link to="/login">Login</router-link>
        , you, beauty
        <span style="display: inline-block; vertical-align: middle;">😏</span>
      </template>
    </Form>
  </div>
</template>

<script>
import Form from '../components/Form';
import { SIGN_UP_REQUEST } from '../store/actions/auth';
import { offlineErrorMessage } from '../mixins/offlineErrorMessage';

export default {
  name: 'SignUp',
  mixins: [ offlineErrorMessage ],
  data() {
    return {
      title: 'Create an account',
      fields: [
        {
          label: 'Enter your email',
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
  @import "../styles/page.css";
</style>
