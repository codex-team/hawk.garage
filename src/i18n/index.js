import ruMessages from './messages/ru';
import enMessages from './messages/en';
import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  pluralizationRules: {
    /**
     * Custom pluralization rule for Russian language.
     *
     * Order: 0 | 1 | 2-4 | 5+
     *
     * @param {number} choice - The number of items.
     * @param {number} choicesLength - The number of choices.
     * @returns {number}
     */
    ru(choice, choicesLength) {
      if (choicesLength === 0) {
        return 0;
      }

      const value = Math.abs(Math.trunc(choice));

      if (value === 0) {
        return 0;
      }

      const mod100 = value % 100;
      const mod10 = mod100 % 10;

      if (mod10 === 1 && mod100 !== 11) {
        return 1;
      }

      if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
        return 2;
      }

      return 3;
    },
  },
  messages: {
    ru: ruMessages,
    en: enMessages,
  },
  legacy: false,
  globalInjection: true,
});

export function setLanguage(lang) {
  i18n.global.locale = lang;
}
