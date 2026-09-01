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
import { getUtmFromQuery } from '../utils/utm/utm';
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
      const utm = getUtmFromQuery(this.$route.query);

      if (!utm) {
        return [];
      }

      return Object.entries(utm).map(([key, value]) => ({
        name: `utm_${key}`,
        value,
        type: 'hidden',
      }));
    },

    /**
     * Get UTM data as object for API calls
     */
    utmData() {
      return getUtmFromQuery(this.$route.query);
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
