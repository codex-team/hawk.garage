<template>
  <div class="yard-sign-up">
    <div class="yard-form">
      <router-link class="yard-form__title" to="/">Hawk.so</router-link>
      <div class="yard-form__caption">Fast and lightweight errors tracking service</div>
      <form class="yard-form__container" method="POST" action="/join">
        <div class="yard-form__header">Create an account</div>
        <fieldset class="yard-form__section">
          <label class="yard-form__label" for="email">Enter your email</label>
          <input
            class="yard-form__input"
            type="email"
            name="email"
            id="email"
            placeholder="name@best-team.com"
            required
          >
        </fieldset>
        <input class="yard-form__submit button--submit" type="submit" value="Register">
      </form>
      <div class="yard-form__disclaimer">Already have an account?
        <router-link to="/login">Login</router-link>, you, beauty
        <span style="display: inline-block; vertical-align: middle;">😏</span>
      </div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "home",
  data() {
    return {
      authed: false
    };
  }
};
</script>

<style lang="postcss">
@import url("../stylesheets/variables.css");
@import url("../stylesheets/yard-form.css");

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
