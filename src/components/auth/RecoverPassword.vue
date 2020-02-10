<template>
  <div class="auth-page">
    <Form
      class="auth-page__form"
      :fields="fields"
      :submit-text="submitText"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Form from './Form.vue';
import VueI18n from 'vue-i18n';

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
  private fields: object[];

  /**
   * Text for submit button in reset password form
   */
  private submitText: VueI18n.TranslateResult;

  /**
   * Component constructor for data initialization
   */
  constructor() {
    super();
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
};
</script>

<style src="../../styles/auth-page.css"></style>
