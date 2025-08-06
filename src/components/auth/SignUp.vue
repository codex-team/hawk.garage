<template>
  <div class="auth-page">
    <Form
      class="auth-page__form"
      :fields="fields"
      :hidden-fields="hiddenFields"
      :submit-text="submitText"
      :message="message"
      @submit="signUp"
    />
  </div>
</template>

<script>
import Form from './Form';
import { SIGN_UP } from '../../store/modules/user/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';
import notifier from 'codex-notifier';

export default {
  components: {
    Form,
  },
  mixins: [ offlineErrorMessage ],
  data() {
    return {
      fields: [
        {
          autoComplete: 'email',
          label: this.$t('authPages.emailAddress'),
          name: 'email',
          value: '',
          placeholder: 'name@best-team.com',
          type: 'email',
        },
      ],
      hiddenFields: this.extractUtmParameters(),
      submitText: this.$t('authPages.signUpSubmitText'),
      message: null,
    };
  },
  methods: {
    /**
     * Extract UTM parameters from URL query string
     */
    extractUtmParameters() {
      const urlParams = new URLSearchParams(window.location.search);
      const utmFields = [];

      const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

      utmParams.forEach((param) => {
        const value = urlParams.get(param);
        if (value) {
          utmFields.push({
            name: param,
            value: value,
            type: 'hidden',
          });
        }
      });

      return utmFields;
    },

    /**
     * Form submit event handler
     */
    async signUp() {
      const email = this.fields[0].value;
      const utmData = {};

      // Collect UTM data from hidden fields and transform to clean format
      this.hiddenFields.forEach((field) => {
        // Remove 'utm_' prefix from field names
        const cleanKey = field.name.replace('utm_', '');
        utmData[cleanKey] = field.value;
      });

      try {
        await this.$store.dispatch(SIGN_UP, {
          email,
          utm: Object.keys(utmData).length > 0 ? utmData : undefined,
        });

        this.$router.push({
          name: 'login',
          params: {
            successMessage: this.$t('authPages.signupSuccessMessage'),
            emailPrefilled: email,
          },
        });
      } catch (e) {
        console.error(e);

        notifier.show({
          message: this.$i18n.t(e.message),
          style: 'error',
        });
      }
    },
  },
};
</script>

<style src="../../styles/auth-page.css"></style>
