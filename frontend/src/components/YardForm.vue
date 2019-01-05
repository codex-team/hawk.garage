<template>
  <div class="yard-form">
    <router-link class="yard-form__title" to="/">Hawk.so</router-link>
    <div class="yard-form__caption">Fast and lightweight errors tracking service</div>
    <form class="yard-form__container">
      <div class="yard-form__header">{{ title }}</div>
      <div
        v-if="message"
        :class="`yard-form__message yard-form__message--${message.type}`"
      >{{ message.text }}</div>
      <fieldset v-for="(field, index) in fields" :key="index" class="yard-form__section">
        <label class="yard-form__label" :for="field.name">{{ field.label}}</label>
        <input
          class="yard-form__input"
          :type="type || 'text'"
          :name="field.name"
          :value="field.value"
          :id="field.name"
          :placeholder="field.placeholder"
          required
        >
      </fieldset>
      <input
        v-if="submitText"
        class="yard-form__submit button--submit"
        type="submit"
        :value="submitText"
      >
      <router-link
        v-if="altText && altLink"
        class="yard-form__alt-button"
        :to="altLink"
      >{{ altText }}</router-link>
    </form>
    <div class="yard-form__disclaimer" v-html="disclaimer"></div>
  </div>
</template>

<script>
export default {
  name: "yard-form",
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
    disclaimer: {
      type: String,
      required: true
    },
    message: {
      type: String
    }
  }
};
</script>

<style lang="postcss">
@import url("../stylesheets/variables.css");

.yard-form {
  max-width: 500px;
  margin: 100px auto;

  @media (--desktop) {
    min-width: 500px;
  }

  @media (--mobile) {
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
    color: var(--grayOnDark);
    font-size: 19px;
  }

  &__container {
    margin: 25px 0;
    background: #fff;
    color: #000;
    padding: 30px;
    border-radius: 2px;

    @media (--desktop) {
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
      color: var(--errorMessage);
    }

    &--notify {
      color: var(--greenText);
    }

    & a {
      text-decoration: underline;
    }
  }

  &__label {
    display: block;
    margin-bottom: 0.7em;
    font-size: 19px;
    color: var(--grayText);
    font-weight: bold;
  }

  &__disclaimer {
    color: #fff;
    font-size: 16px;

    a {
      color: var(--linkOnDark);
      border-bottom: 1px solid color(var(--linkOnDark) alpha(50%));
      padding-bottom: 1px;

      &:hover {
        color: color(var(--linkOnDark) lightness(+20%));
        border-bottom-color: color(
          color(var(--linkOnDark) lightness(+20%)) alpha(50%)
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
    color: var(--grayText);
    font-size: 16px;
  }
}
</style>
