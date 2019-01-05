<template>
  <div class="yard-page yard-sign-up">
    <yard-form
      :title="title"
      :fields="fields"
      :submitText="submitText"
      :message="message"
    >
      <div slot="disclaimer">Already have an account?
        <router-link to="/login">Login</router-link>, you, beauty
        <span style="display: inline-block; vertical-align: middle;">😏</span>
      </div>
    </yard-form>
  </div>
</template>

<script>
import YardForm from "@/components/YardForm";

export default {
  name: "sign-up",
  data() {
    return {
      title: "Create an account",
      fields: [
        {
          label: "Enter your email",
          name: "email",
          value: "",
          placeholder: "name@best-team.com",
          type: "email"
        }
      ],
      submitText: "Register",
      message: null
    };
  },
  components: {
    YardForm
  }
};
</script>
