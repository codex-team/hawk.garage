<template>
  <div class="page sign-up-page">
    <Form
      :title="title"
      :fields="fields"
      :submitText="submitText"
      :message="message"
    >
      <template #disclaimer>Already have an account?
        <router-link to="/login">Login</router-link>, you, beauty
        <span style="display: inline-block; vertical-align: middle;">😏</span>
      </template>
    </Form>
  </div>
</template>

<script>
import Form from '../components/Form';

export default {
  name: 'SignUp',
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
  components: {
    Form
  },
  beforeMount() {
    if (!navigator.onLine) {
      this.message = { text: 'Sorry... Your internet connection lost ⛔' };
    }
  }
};
</script>

<style>
  @import "../styles/page.css";
</style>
