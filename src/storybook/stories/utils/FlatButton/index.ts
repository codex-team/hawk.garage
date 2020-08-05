import FilterButton from '@components/utils/FilterButton.vue';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';

export default {
  title: 'Utils/FilterButton',
  component: FilterButton,
  decorators: [withKnobs, centered],
};

const methods = {
  click: action('clicked'),
};

export const Default = (): unknown => ({
  components: { FilterButton },
  template: `
    <FilterButton :content="content" @click="click" />
  `,
  props: {
    content: {
      type: String,
      default: 'Click Me',
    },
  },
  methods,
});

export const Active = (): unknown => ({
  components: { FilterButton },
  template: `
    <FilterButton :content="content" @click="click" active />
  `,
  props: {
    content: {
      type: String,
      default: 'Click Me',
    },
  },
  methods,
});
