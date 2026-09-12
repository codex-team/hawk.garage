<template>
  <div class="auth-page">
    <FormComponent
      class="auth-page__form"
      :submit-text="submitText"
      @form-submit="concent"
    >
      <template #heading>
        <h2 class="auth-form__header">

        </h2>
      </template>
      <template #before-fields>
        <div>

        </div>
      </template>
    </FormComponent>
  </div>
</template>

<script>
import { offlineErrorMessage } from "@/mixins/offlineErrorMessage";
import FormComponent from "./Form";

export default {
  name: 'Concent',
  components: {
    FormComponent
  },
  mixins: [offlineErrorMessage],
  data() {
    return {
      submitText: this.$t('authPages.concentText')
    };
  },
  props: {
    redirect_uri: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    client_id: {
      type: String,
      default: ''
    },
    code_challenge: {
      type: String,
      default: ''
    }
  },
  methods: {
    async concent() {
      const response = await fetch("http://localhost:4000/concent/integration/mcp", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.$store.state.user.accessToken}`
        },

        body: JSON.stringify({
          client_id: this.$props.client_id,
          redirect_uri: this.$props.redirect_uri,
          state: this.$props.state,
          code_challenge: this.$props.code_challenge
        })
      });

      const result = await response.json();

      window.location.href = result.redirect_uri;
    }
  }
}
</script>

<style src="../../styles/auth-page.css"></style>
