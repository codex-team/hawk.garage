<template>
  <div class="yard-sign-up">
    <yard-form
      :title="title"
      :fields="fields"
      :submitText="submitText"
      :disclaimer="disclaimer"
      :message="message"
    ></yard-form>
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
      disclaimer:
        'Already have an account? <router-link to="/login">Login</router-link>, you, beauty <span style="display: inline-block; vertical-align: middle;"> 😏 </span>',
      message: null
    };
  },
  components: {
    YardForm
  }
};
</script>

<style lang="postcss">
@import url("../stylesheets/variables.css");

.yard-sign-up {
  width: 100%;
  background: var(--yardBg);
  color: var(--yardGrayText);
  padding: 60px;
  padding-bottom: 20px;
  font-size: 20px;

  @media (--mobile) {
    padding: 15px;
  }
}
</style>
