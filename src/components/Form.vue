<template>
  <div class="form">
    <router-link class="form__title" to="/">Hawk.so</router-link>
    <div class="form__caption">Fast and lightweight errors tracking service</div>
    <form class="form__container"  @submit.prevent="$emit('submit')">
      <div class="form__header">{{ title }}</div>
      <div
        v-if="message"
        :class="`form__message form__message--${message.type}`"
      >{{ message.text }}
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
    <div class="form__disclaimer">
      <slot name="disclaimer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    title: {
      type: String,
      required: true
    },
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
  @import "../styles/variables.css";

  .form {
    max-width: 500px;
    margin: 0 auto;

    @media (--media-desktop) {
      min-width: 500px;
    }

    @media (--media-mobile) {
      padding: 20px;
      margin: 0 auto;
    }

    &__title {
      display: block;
      margin-bottom: 5px;
      color: #fff;
      font-size: 27px;
      font-weight: bold;
    }

    &__caption {
      color: var(--color-text-gray-on-dark);
      font-size: 19px;
    }

    &__container {
      margin: 25px 0;
      background: #fff;
      color: #000;
      padding: 30px;
      border-radius: 2px;

      @media (--media-desktop) {
        margin: 25px -30px;
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
      line-height: 1.4em;

      &--error {
        color: var(--color-text-error-message);
      }

      &--notify {
        color: var(--color-text-green);
      }

      & a {
        text-decoration: underline;
      }
    }

    &__label {
      display: block;
      margin-bottom: 0.7em;
      font-size: 19px;
      color: var(--color-text-form-gray);
      font-weight: bold;
    }

    &__disclaimer {
      color: #fff;
      font-size: 16px;

      a {
        color: var(--color-text-link-on-dark);
        border-bottom: 1px solid color-mod(var(--color-text-link-on-dark) alpha(50%));
        padding-bottom: 1px;

        &:hover {
          color: color-mod(var(--color-text-link-on-dark) lightness(+20%));
          border-bottom-color: color-mod(
            color-mod(var(--color-text-link-on-dark) lightness(+20%)) alpha(50%)
          );
        }
      }
    }

    &__section {
      border: 0;
      padding: 0;
      margin: 0 0 25px;
    }

    &__submit {
      font-size: 17px;
    }

    &__alt-button {
      display: inline-block;
      padding: 10px 24px;
      color: var(--color-text-form-gray);
      font-size: 16px;
    }
  }
</style>
