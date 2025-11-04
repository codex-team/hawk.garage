<template>
  <div class="auth-page">
    <FormComponent
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
      :message="message"
      @submit="recoverPassword"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormComponent from './Form.vue';
import VueI18n from 'vue-i18n';
import { RECOVER_PASSWORD } from '../../store/modules/user/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';
import notifier from 'codex-notifier';

/**
 * Class implements reset password form component
 */
export default defineComponent({
  name: 'RecoverPassword',
  components: {
    FormComponent,
  },
  mixins: [
    offlineErrorMessage,
  ],
  data(): {
    /**
     * Fields for reset password form
     */
    fields: {
      autoComplete: string;
      label: VueI18n.TranslateResult;
      name: string;
      value: string;
      placeholder: string;
      type: string;
    }[];

    /**
     * Text for submit button in reset password form
     */
    submitText: VueI18n.TranslateResult;

    /**
     * Field for displaying errors
     */
    message: { text: any;
      type: string; } | null;
  } {
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
      submitText: this.$t('authPages.recoverPassword'),
      message: null,
    };
  },

  methods: {
    /**
     * Method recover user's password by email from form
     */
    async recoverPassword(): Promise<void> {
      const emailField = this.fields.find(field => field.name === 'email');
      const email = emailField ? emailField.value : '';

      try {
        await this.$store.dispatch(RECOVER_PASSWORD, { email });

        this.$router.push({
          name: 'login',
          params: {
            successMessage: this.$t('authPages.recoverPasswordSuccessMessage') as string,
            emailPrefilled: email,
          },
        });
      } catch (e) {
        console.error(e);

        notifier.show({
          message: this.$i18n.t(e.message) as string,
          style: 'error',
        });
      }
    },
  },
});
</script>

<style src="../../styles/auth-page.css"></style>
