<template>
  <div class="language-select">
    <label class="label">Interface Language</label>
    <div class="language-select__option language-select__option--ru">
      <input
        id="ru"
        class="language-select__radio-button"
        name="language"
        type="radio"
      >
      <label for="ru">Russian</label>
    </div>
    <hr class="language-select__delimiter">
    <div class="language-select__option language-select__option--en">
      <input
        id="en"
        class="language-select__radio-button"
        name="language"
        type="radio"
      >
      <label for="en">English</label>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { SET_LANGUAGE } from '../../store/modules/app/actionTypes';

export default {
  name: 'LanguageSelect',
  computed: mapState({
    language: state => state.app.language
  }),
  methods: {
    changeLanguage(e) {
      this.$store.dispatch(SET_LANGUAGE, e.target.value);
    }
  }
};
</script>

<style>
  .language-select {
    &__option {
      padding: 15px 0 15px 50px;
      display: flex;
      line-height: 28px;
      letter-spacing: 0.19px;
      justify-content: center;

      label {
        position: relative;
      }

      &--ru {
        background: no-repeat 0/33px 100% url("../../assets/ru.svg");
      }

      &--en {
        background: no-repeat 0/33px 100% url("../../assets/uk.svg");
      }
    }

    &__radio-button {
      margin-left: auto;
      opacity: 0;
      /*position: fixed;*/
      /*width: 0;*/
      height: 28px;

      &:checked ~ label::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 18px;
        height: 18px;
        border: 1px solid #ddd;
        border-radius: 100%;
        background: #fff;      }
    }

    &__delimiter {
      margin: 0;
      border: 1px solid var(--color-text-second);
      opacity: 0.1;
    }
  }
</style>
