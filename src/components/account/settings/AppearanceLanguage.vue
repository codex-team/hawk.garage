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
import RadioButtonGroup from '../../forms/RadioButtonGroup';
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
            image: require('../../../assets/ru.svg'),
          },
          {
            name: this.$t('components.languageSelect.en'),
            id: 'en',
            image: require('../../../assets/uk.svg'),
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
