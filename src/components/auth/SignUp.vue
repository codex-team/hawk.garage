<template>
  <div class="auth-page">
    <Form
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
      :message="message"
      @submit="signUp"
    />
  </div>
</template>

<script>
import Form from './Form';
import { SIGN_UP } from '../../store/modules/auth/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';

export default {
  components: {
    Form
  },
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
        this.$router.push('/login');
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
