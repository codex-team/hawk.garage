<template>
  <div class="auth-form">
    <div class="auth-form__block-title">
      <div class="auth-form__title">
        Hawk
      </div>
      <div class="auth-form__caption">
        Time for quality
      </div>
    </div>
    <!--    <div class="auth-form__social-block">-->
    <!--      <a-->
    <!--        class="auth-form__github-button"-->
    <!--        :href="$API_AUTH_GITHUB"-->
    <!--      >{{ $t('authPages.githubButton') }}</a>-->
    <!--      <a-->
    <!--        class="auth-form__google-button"-->
    <!--        :href="$API_AUTH_GOOGLE"-->
    <!--      >{{ $t('authPages.googleButton') }}</a>-->
    <!--    </div>-->
    <SuccessMessage
      v-if="isPasswordRecoverSuccess"
    />
    <div class="auth-form__container">
      <div class="auth-form__picture" />
      <form
        class="auth-form__fields-container"
        @submit.prevent="$emit('submit')"
      >
        <div class="auth-form__links">
          <router-link to="/login">
            {{ $t('authPages.login') }}
          </router-link>
          <router-link to="/sign-up">
            {{ $t('authPages.signUp') }}
          </router-link>
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
          v-model="field.value"
          class="auth-form__section"
          required
          :name="field.name"
          :type="field.type"
          :label="field.label"
          :placeholder="field.placeholder"
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
import SuccessMessage from './SuccessMessage';

export default {
  name: 'AuthForm',
  components: {
    TextFieldset,
    SuccessMessage,
  },
  props: {
    fields: {
      type: Array,
      required: true,
    },
    submitText: {
      type: String,
      required: true,
    },
    message: {
      type: Object,
      default: null,
    },
    altText: {
      type: String,
      default: null,
    },
    altLink: {
      type: String,
      default: null,
    },
    /**
     * Show success message about sending message to email
     * If recovering password was successful
     */
    isPasswordRecoverSuccess: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.auth-form {
  &__block-title {
    margin-bottom: 25px;
    text-align: center;
  }

  &__title {
    display: inline-block;
    margin-bottom: 10px;
    color: #fff;
    font-weight: bold;
    font-size: 30px;
  }

  &__caption {
    color: var(--color-text-second);
    font-size: 16px;
  }

  &__social-block {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
  }

  &__github-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin-left: 15px;
    padding-right: 15px;
    padding-left: 44px;
    color: #ffffff;
    font-weight: 500;
    font-size: 14.4px;
    background: no-repeat 15px/18px 100% url("../../assets/github.svg");
    background-color: #101216;
    border-radius: 4px;
  }

  &__github-button:hover {
    background-color: #07080a;
  }

  &__google-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin-left: 15px;
    padding-right: 15px;
    padding-left: 44px;
    color: var(--color-text-dark);
    font-weight: 500;
    font-size: 14.4px;
    background: no-repeat 15px/18px 100% url("../../assets/google.svg");
    background-color: #ffffff;
    border-radius: 4px;
  }

  &__google-button:hover {
    background-color: #e6eeff;
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
