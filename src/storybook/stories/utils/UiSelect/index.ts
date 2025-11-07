import UiSelect, { UiSelectOption } from '@/components/utils/UiSelect.vue';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';

export default {
  title: 'Utils/UiSelect',
  component: UiSelect,
  decorators: [withKnobs, centered],
};

export const Default = (): unknown => ({
  components: { UiSelect },
  template: `
    <UiSelect
      v-model="value"
      :icon-left="iconLeft"
      :icon-right="iconRight"
      :options="options"
    />
  `,
  data() {
    return {
      value: 'month',
    };
  },
  props: {
    iconLeft: {
      type: String,
      default: (() => {
        const icons = ['clock', 'calendar', 'chart'];

        return select('Icon Left', icons, 'clock');
      })(),
    },
    iconRight: {
      type: String,
      default: select('Icon Right', ['chevron-down', 'plus', 'flash'], 'chevron-down'),
    },
    options: {
      type: Array as () => UiSelectOption[],
      default: () => [
        {
          label: 'За час',
          value: 'hour',
        },
        {
          label: 'За неделю',
          value: 'week',
        },
        {
          label: 'За месяц',
          value: 'month',
        },
      ],
    },
  },
});
