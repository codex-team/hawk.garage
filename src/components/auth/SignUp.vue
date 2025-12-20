<template>
  <div class="auth-page">
    <FormComponent
      class="auth-page__form"
      :fields="fields"
      :hidden-fields="hiddenFields"
      :submit-text="submitText"
      :message="message"
      :helper-text="isVisitedByInvite ? $t('authPages.inviteHelper') : null"
      @form-submit="signUp"
    />
  </div>
</template>

<script>
import FormComponent from './Form';
import { SIGN_UP } from '../../store/modules/user/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';
import notifier from 'codex-notifier';
import { validateUtmParams } from '../utils/utm/utm';
import { getCookie } from '../../utils';


export default {
  components: {
    FormComponent,
  },
  mixins: [offlineErrorMessage],
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
      submitText: this.$t('authPages.signUpSubmitText'),
      message: null,
    };
  },
  computed: {
    /**
     * Extract and validate UTM parameters from route query
     */
    hiddenFields() {
      const utmFields = [];

      // Extract and validate each utm_ param individually
      Object.entries(this.$route.query).forEach(([key, value]) => {
        if (key.startsWith('utm_') && value) {
          const cleanKey = key.replace('utm_', '');

          // Validate single param
          const singleParam = { [cleanKey]: value };
          const validatedParam = validateUtmParams(singleParam);

          // If this param is valid, add to fields
          if (validatedParam[cleanKey]) {
            utmFields.push({
              name: key, // keep original utm_ prefix
              value: validatedParam[cleanKey],
              type: 'hidden',
            });
          }
        }
      });

      return utmFields;
    },

    /**
     * Get UTM data as object for API calls
     */
    utmData() {
      const utmData = {};

      this.hiddenFields.forEach((field) => {
        // Remove 'utm_' prefix from field names
        const cleanKey = field.name.replace('utm_', '');

        utmData[cleanKey] = field.value;
      });

      return Object.keys(utmData).length > 0 ? utmData : undefined;
    },

    /**
     * True when user was redirected to login page by invite
     * Used to show Invite helper above the form
     */
    isVisitedByInvite() {
      return getCookie('afterAuthRedirect') !== '';
    },
  },
  methods: {
    /**
     * Form submit event handler
     */
    async signUp() {
      const email = this.fields[0].value;

      try {
        await this.$store.dispatch(SIGN_UP, {
          email,
          utm: this.utmData,
        });

        this.$router.push({
          name: 'login',
          query: {
            success: 'signup',
            emailPrefilled: email,
          },
        });
      } catch (e) {
        console.error(e);

        notifier.show({
          message: this.$t(`authPages.errors.${e.message}`),
          style: 'error',
        });
      }
    },
  },
};
</script>

<style src="../../styles/auth-page.css"></style>
