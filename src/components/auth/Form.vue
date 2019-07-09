<template>
  <div class="auth-form">
    <router-link class="auth-form__title" to="/">Hawk</router-link>
    <div class="auth-form__caption">Time for quality</div>
    <div class="auth-form__container">
      <div class="auth-form__picture"></div>
      <form class="auth-form__fields-container" @submit.prevent="$emit('submit')">
        <div class="auth-form__links">
          <router-link to="/login">Login</router-link>
          <router-link to="/sign-up">Sign up</router-link>
        </div>
        <hr class="auth-form__delimiter">
        <div
          v-if="message"
          :class="`auth-form__message auth-form__message--${message.type}`"
        >
          {{ message.text }}
        </div>
        <TextFieldset
          v-for="(field, index) in fields"
          :key="index"
          class="auth-form__section"
          :name="field.name"
          :type="field.type"
          :label="field.label"
          :placeholder="field.placeholder"
          v-model="field.value"
        />
        <div class="auth-form__action-container">
          <input
            v-if="submitText"
            class="button button--submit"
            type="submit"
            :value="submitText"
          >
          <router-link
            v-if="altText && altLink"
            class="auth-form__alt-button"
            :to="altLink"
          >
            {{ altText }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import TextFieldset from '../forms/TextFieldset';

export default {
  name: 'AuthForm',
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
  },
  components: {
    TextFieldset
  }
};
</script>

<style>
  .auth-form {
    &__title {
      display: inline-block;
      color: #fff;
      font-weight: bold;
      font-size: 19px;
    }

    &__caption {
      display: inline-block;
      margin-left: 15px;
      color: var(--color-text-second);
      font-size: 14px;
    }

    &__title,
    &__caption {
      margin-bottom: 15px;
    }

    &__container {
      display: flex;
      height: 345px;
      background: var(--color-bg-second);
      border: solid 1px #343949;
      border-radius: 7px;
      box-shadow: 0 10px 11px -10px rgba(13, 15, 26, 0.49);

      @media (--media-mobile) {
        height: auto;
      }
    }

    &__picture {
      width: 205px;
      background-image: url("../../assets/hawk.png");
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
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 18px;

      @media (--media-mobile) {
        font-size: 15px;
      }

      .router-link-active {
        order: 1;
        color: var(--color-text-main);
      }

      a:hover {
        color: var(--color-text-main);
      }
    }

    &__delimiter {
      height: 1px;
      margin: 20px 0 25px;
      background: var(--color-text-main);
      border: 0;
      opacity: 0.11;

      @media (--media-mobile) {
        margin: 15px 0 20px;
      }
    }

    &__fields-container {
      flex-grow: 1;
      padding: 30px 48px 35px 30px;

      @media (--media-mobile) {
        padding: 20px;
      }
    }

    &__header {
      margin-bottom: 25px;
      font-weight: 800;
      font-size: 27px;
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

    &__section {
      margin: 0 0 20px;
    }

    &__action-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 30px;

      @media (--media-mobile) {
        margin-top: 20px;
      }
    }

    &__alt-button {
      color: var(--color-text-second);
      font-size: 13px;

      &:hover {
        color: var(--color-text-main);
      }
    }
  }
</style>
