<template>
  <div class="page sign-up-page">
    <Form
      :title="title"
      :fields="fields"
      :submitText="submitText"
      :message="message"
      :altLink="altLink"
      :altText="altText"
    >
      <template #disclaimer>
        Don't have an account? Please, <router-link to="/sign-up">sign up</router-link> one.
      </template>
    </Form>
  </div>
</template>

<script>
import Form from '../components/Form';
import { offlineErrorMessage } from '../mixins/offline-error-message';

export default {
  name: 'Login',
  mixins: [ offlineErrorMessage ],
  data() {
    return {
      title: 'Log in',
      fields: [
        {
          label: 'Your email',
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
      altText: 'Reset password',
      submitText: 'Login',
      message: null
    };
  },
  components: {
    Form
  }
};
</script>

<style>
  @import "../styles/page.css";
</style>
