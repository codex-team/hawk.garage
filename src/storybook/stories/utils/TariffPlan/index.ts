import TariffPlan from '@/components/utils/TariffPlan.vue';
import secondaryBackground from '@/storybook/decorators/secondaryBackground';
import centered from '@/storybook/decorators/centered';
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs';
import store from '@/store';
import router from '@/router';
import i18n from '@/i18n';

export default {
  title: 'Utils/TariffPlan',
  component: TariffPlan,
  decorators: [centered, secondaryBackground, withKnobs],
};

export const Default = (): unknown => ({
  components: { TariffPlan },
  template: `<TariffPlan :name="name" :limit="limit" :price="price" :selected="selected" />`,
  props: {
    name: {
      type: String,
      default: text('Name', 'StartUp'),
    },
    limit: {
      type: Number,
      default: number('Limit', 10000),
    },
    price: {
      type: Number,
      default: number('Price', 0),
    },
    selected: {
      type: Boolean,
      default: boolean('Selected', false),
    },
  },
  store,
  router,
  i18n,
});
