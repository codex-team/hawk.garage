<template>
  <div class="auth-page">
    <Form
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
      :message="message"
      @submit="recoverPassword"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Form from './Form.vue';
import VueI18n from 'vue-i18n';
import { RECOVER_PASSWORD } from '../../store/modules/user/actionTypes';
import { offlineErrorMessage } from '../../mixins/offlineErrorMessage';
import notifier from 'codex-notifier';

@Component({
  name: 'RecoverPassword',
  components: {
    Form,
  },
  mixins: [
    offlineErrorMessage,
  ],
})
/**
 * Class implements reset password form component
 */
export default class RecoverPassword extends Vue {
  /**
   * Fields for reset password form
   */
  private fields!: {
      autoComplete: string,
      label: VueI18n.TranslateResult,
      name: string,
      value: string,
      placeholder: string,
      type: string
  }[];

  /**
   * Text for submit button in reset password form
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  private submitText!: VueI18n.TranslateResult;

  /**
   * Field for displaying errors
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  private message: {text: any, type: string} | null = null;

  /**
   * Vue created hook for data initialization
   */
  created() {
    this.fields = [
      {
        autoComplete: 'username',
        label: this.$t('authPages.emailAddress'),
        name: 'email',
        value: '',
        placeholder: 'name@best-team.com',
        type: 'email',
      },
    ];
    this.submitText = this.$t('authPages.recoverPassword');
  }

  /**
   * Method recover user's password by email from form
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  private async recoverPassword(): Promise<void> {
    const emailField = this.fields.find(field => field.name === 'email');
    const email = emailField ? emailField.value : '';

    try {
      await this.$store.dispatch(RECOVER_PASSWORD, { email });

      this.$router.push({
        name: 'login',
        params: { isPasswordRecoverSuccess: 'true' },
      });
    } catch (e) {
      console.error(e);

      notifier.show({
        message: this.$i18n.t(e.message) as string,
        style: 'error',
      });
    }
  }
};
</script>

<style src="../../styles/auth-page.css"></style>
