import CircleProgress from '@/components/utils/CircleProgress.vue';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Utils/CircleProgress',
  component: CircleProgress,
};

export const Progress = (): unknown => ({
  components: { CircleProgress },
  template: `
    <CircleProgress
      style="margin: auto;"
      :current="current"
      :max="max"
      :width="100"
      :height="100"
      :stroke-width="5"
    />
  `,
  props: {
    current: {
      type: Number,
      default: number('Current', 30),
    },
    max: {
      type: Number,
      default: number('Max', 100),
    },
  },
});
