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
import * as userApi from '../../api/user/index.js';

@Component({
  name: 'RecoverPassword',
  components: {
    Form
  }
})
/**
 * Class implements reset password form component
 */
export default class RecoverPassword extends Vue {
  /**
   * Fields for reset password form
   */
  private fields!: {
      label: VueI18n.TranslateResult,
      name: string,
      value: string,
      placeholder: string,
      type: string
  }[];

  /**
   * Text for submit button in reset password form
   */
  private submitText!: VueI18n.TranslateResult;

  /**
   * Field for displaying errors
   */
  private message: {text: any, type: string} | null = null;

  /**
   * Vue created hook for data initialization
   */
  created() {
    this.fields = [
      {
        label: this.$t('authPages.emailAddress'),
        name: 'email',
        value: '',
        placeholder: 'name@best-team.com',
        type: 'email'
      }
    ];
    this.submitText = this.$t('authPages.recoverPassword');
  }

  /**
   * Method recover user's password by email from form
   */
  private async recoverPassword(): Promise<void> {
    const email = this.fields[0].value;

    try {
      await userApi.recoverPassword(email);
      this.$router.push('/login');
    } catch (e) {
      this.message = {
        text: e.message,
        type: 'error'
      };
    }
  }
};
</script>

<style src="../../styles/auth-page.css"></style>
