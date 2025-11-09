<template>
  <RadioButtonGroup
    :name="formData.name"
    :label="formData.label"
    :options="formData.options"
    :value="language"
    @input="changeLanguage"
  />
</template>

<script>
import { mapState } from 'vuex';
import { SET_LANGUAGE } from '../../../store/modules/app/actionTypes';
import RadioButtonGroup from '../../forms/RadioButtonGroup.vue';
import ruSvg from '../../../assets/ru.svg';
import ukSvg from '../../../assets/uk.svg';

export default {
  name: 'AppearanceLanguage',
  components: {
    RadioButtonGroup,
  },
  computed: {
    formData() {
      return {
        name: 'language',
        label: this.$t('components.languageSelect.label'),
        options: [
          {
            name: this.$t('components.languageSelect.ru'),
            id: 'ru',
            image: ruSvg,
          },
          {
            name: this.$t('components.languageSelect.en'),
            id: 'en',
            image: ukSvg,
          },
        ],
      };
    },
    ...mapState({
      language: state => state.app.language,
    }),
  },
  methods: {
    changeLanguage(e) {
      this.$store.dispatch(SET_LANGUAGE, e);
    },
  },
};
</script>
