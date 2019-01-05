<template>
  <div class="yard-page yard-login">
    <yard-form
      :title="title"
      :fields="fields"
      :submitText="submitText"
      :altText="altText"
      :altLink="altLink"
    >
    <div slot="disclaimer">
      Don't have an account? Please, <router-link to="/sign-up">sign up</router-link> one.
    </div>
    </yard-form>
  </div>
</template>

<script>
import YardForm from '@/components/YardForm';

export default {
  name: 'login',
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
      submitText: 'Log in',
      altLink: '/reset',
      altText: 'Reset password'
    };
  },
  components: {
    YardForm
  }
};
</script>
