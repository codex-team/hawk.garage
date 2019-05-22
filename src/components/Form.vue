<template>
  <div class="form">
    <router-link class="form__title" to="/">Hawk</router-link>
    <div class="form__caption">Time for quality</div>
    <div class="form__container">
      <div class="form__picture"></div>
      <form class="form__fields-container" @submit.prevent="$emit('submit')">
        <div class="form__links">
          <router-link to="/login">Login</router-link>
          <router-link to="/sign-up">Sign up</router-link>
        </div>
        <hr class="form__delimiter">
        <div
          v-if="message"
          :class="`form__message form__message--${message.type}`"
        >
          {{ message.text }}
        </div>
        <fieldset v-for="(field, index) in fields" :key="index" class="form__section">
          <label class="form__label" :for="field.name">{{ field.label}}</label>
          <input
            class="form__input"
            :type="field.type || 'text'"
            :name="field.name"
            v-model="field.value"
            :id="field.name"
            :placeholder="field.placeholder"
            required
          >
        </fieldset>
        <input
          v-if="submitText"
          class="button form__submit button--submit"
          type="submit"
          :value="submitText"
        >
        <router-link
          v-if="altText && altLink"
          class="form__alt-button"
          :to="altLink"
        >{{ altText }}
        </router-link>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    fields: {
      type: Array,
      required: true
    },
    submitText: {
      type: String,
      required: true
    },
    message: {
      type: Object,
      required: false
    },
    altText: {
      type: String,
      required: false
    },
    altLink: {
      type: String,
      required: false
    }
  }
};
</script>

<style>
  .form {
    margin: 0 auto;

    &__title {
      margin-bottom: 17px;
      color: #fff;
      font-size: 19px;
      font-weight: bold;
    }

    &__caption {
      margin-bottom: 17px;
      margin-left: 15px;

      display: inline-block;
      color: var(--color-text-second);
      font-size: 14px;
    }

    &__container {
      height: 345px;
      display: flex;
      border-radius: 7px;
      box-shadow: 0 10px 11px -10px rgba(13, 15, 26, 0.49);
      border: solid 1px #343949;
      background: var(--color-bg-second);

      @media (--media-mobile) {
        height: auto;
      }
    }

    &__picture {
      width: 205px;
      background-image: url("../assets/hawk.png");
      background-position: center center;
      background-size: cover;
      border-radius: inherit;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      @media (--media-mobile) {
        display: none;
      }
    }

    &__links {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      font-weight: bold;
      font-size: 18px;
      color: var(--color-text-second);

      .router-link-active {
        order: 1;
        color: var(--color-text-main);
      }

      a:hover {
        color: var(--color-text-main);
      }
    }

    &__delimiter {
      opacity: 0.11;
      margin: 19.5px 0 24.5px 0;
      border-top: solid 1px var(--color-text-main);
    }

    &__fields-container {
      padding: 30px 48px 35px 30px;

      @media(--media-mobile){
        padding: 20px;
      }
    }

    &__header {
      margin-bottom: 25px;
      font-size: 27px;
      font-weight: 800;
    }

    &__message {
      margin-top: -5px;
      margin-bottom: 20px;
      font-size: 17px;

      &--error {
        color: var(--color-indicator-critical);
      }

      &--notify {
        color: var(--color-indicator-medium);
      }
    }

    &__label {
      display: block;
      margin-bottom: 9px;
      text-transform: uppercase;
      font-size: 12px;
      color: var(--color-text-second);
      font-weight: bold;
    }

    &__section {
      border: 0;
      padding: 0;
      margin: 0 0 20px;
    }

    &__submit {
      font-size: 17px;
      margin-top: 10px;
    }

    &__alt-button {
      display: inline-block;
      padding: 10px 24px;
      color: var(--color-text-second);
      font-size: 13px;

      @media (--media-mobile) {
        padding: 10px 20px;
      }

      &:hover {
        color: var(--color-text-main);
      }
    }
  }
</style>
