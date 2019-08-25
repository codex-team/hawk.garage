<template>
  <RadioButtonGroup
    :name="name"
    :label="label"
    :options="options"
    :value="language"
    @input="changeLanguage"
  />
</template>

<script>
import { mapState } from 'vuex';
import { SET_LANGUAGE } from '../../store/modules/app/actionTypes';
import RadioButtonGroup from './RadioButtonGroup';
export default {
  name: 'LanguageSelect',
  components: {
    RadioButtonGroup
  },
  data() {
    return {
      name: 'language',
      label: 'Interface Language',
      options: [
        {
          name: 'Russia',
          id: 'ru',
          image: require('../../assets/ru.svg')
        },
        {
          name: 'English',
          id: 'en',
          image: require('../../assets/uk.svg')
        }
      ]
    };
  },
  computed: mapState({
    language: state => state.app.language
  }),
  methods: {
    changeLanguage(e) {
      this.$store.dispatch(SET_LANGUAGE, e);
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
      position: relative;

      &:focus {
        color: red;
      }

      &::after {
        margin-left: auto;
        content: '';
        width: 28px;
        height: 28px;
        border: 1px solid var(--color-bg-sidebar);
        border-radius: 100%;
        background: var(--color-bg-main);
      }

      &--ru {
        background: no-repeat 0/33px 100% url("../../assets/ru.svg");
      }

      &--en {
        background: no-repeat 0/33px 100% url("../../assets/uk.svg");
      }
    }

    &__radio-button {
      /*opacity: 0;*/

      &:checked + label::after {
        background-image: url("../../assets/sprite-icons/tick.svg");
      }

      &:focus + label::after {
        color: red;
      }
    }

    &__delimiter {
      margin: 0;
      border: 1px solid var(--color-text-second);
      opacity: 0.1;
    }
  }
</style>
