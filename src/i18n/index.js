import ruMessages from './messages/ru';
import enMessages from './messages/en';
import { createI18n } from 'vue-i18n'


export const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  messages: {
    ru: ruMessages,
    en: enMessages,
  },
  legacy: true,
})
