<template>
  <div class="yard-home">
    <h1 class="yard-home__title">Hawk.so</h1>
    <p class="yard-home__caption">
      Fast and lightweight errors tracking service. Backend and Frontend events
      monitoring.
    </p>
    <ul class="yard-home__links">
      <li v-if="authed">
        <router-link class="primary" to="/garage">
          <!--{{ user.email|escape }}-->
          <!--{{ svg('/public/svg/arrow-right.svg') }}-->
        </router-link>
      </li>
      <template v-else>
        <li>
          <router-link class="primary" to="/garage">Try for free</router-link>
        </li>
        <li>
          <router-link to="/join">Sign up</router-link>
        </li>
        <li>
          <router-link to="/login">Login</router-link>
        </li>
      </template>

      <li>
        <router-link to="/docs">Documentation</router-link>
      </li>
    </ul>
    <figure class="yard-home__figure">
      <router-link to="/garage">
        <img src="../assets/views/home/list.png" alt="Backend and Frontend errors monitoring">
      </router-link>
    </figure>

    <div class="yard-home__footer">
      Made with inspiration by
      <a href="//ifmo.su">CodeX</a>.
      <div class="fl_r">
        Feel free to leave a Feedback to the
        <a href="mailto:team@ifmo.su?subject=Hawk">team@ifmo.su</a>.
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

.yard-home {
  width: 100%;
  background: var(--yardBg);
  color: var(--yardGrayText);
  padding: 60px;
  padding-bottom: 20px;
  font-size: 20px;

  @media (--mobile) {
    padding: 15px;
  }

  &__title {
    font-size: 2.6em;
    color: #fff;
  }

  &__caption {
    color: var(--yardGrayText);
    line-height: 1.4em;
  }

  &__links {
    margin-top: 1em;
    font-weight: bold;
    padding: 0;

    li {
      display: inline-block;
      margin-right: 1em;
      margin-bottom: 0.6em;
    }

    a {
      color: #fff;

      &.primary {
        color: var(--linkOnDark);
      }

      svg {
        margin-left: 0.6em;
      }
    }
  }

  &__figure {
    margin: 0 0 30px;
    color: var(--yardGrayText);

    img {
      margin-top: 1em;
      max-width: 100%;
    }
  }

  &__footer {
    border-top: 1px solid color(var(--yardBg) lightness(+5%));
    font-size: 15px;
    padding: 20px 0 0;
    letter-spacing: 0.18px;

    a {
      color: var(--greenText);
      border-bottom: 1px solid color(var(--greenText) alpha(60%));

      &:hover {
        color: #fff;
        border-bottom-color: color(#fff alpha(60%));
      }
    }

    .fl_r {
      @media (--mobile) {
        float: none;
        margin-top: 8px;
      }
    }
  }
}
</style>
