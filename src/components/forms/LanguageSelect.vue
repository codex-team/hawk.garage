<template>
  <select
    :value="language"
    @input="changeLanguage"
  >
    <option value="ru">
      Russian
    </option>
    <option value="en">
      English
    </option>
  </select>
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
