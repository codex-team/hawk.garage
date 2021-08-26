import Chart from '@/components/events/Chart.vue';
import {boolean, object, text, withKnobs} from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';


export default {
  title: 'Events/Chart',
  component: [Chart],
  decorators: [
    withKnobs,
    () => ({
      template: `
        <div style="width: 600px">
            <story />
        </div>
      `,
    }),
    centered,
  ],
};

const today = new Date();

today.setHours(0, 0, 0, 0);

const twoWeeksAgo = new Date().setDate(today.getDate() - 14);

const points = Array.from({length: 14}, (_, i) => ({
  timestamp: twoWeeksAgo + i * 24 * 60 * 60 * 1000,
  count: 0,
}));

export const Default = (): unknown => ({
  components: {Chart},
  template: `
    <Chart :points="points" :label="label" :isLoading="loading"/>
  `,
  props: {
    points: {
      type: Array,
      default: object('points', points),
    },
    label: {
      type: String,
      default: text('Label', 'event.daily.label')
    },
    loading: {
      type: Boolean,
      default: boolean('isLoading', false)
    }
  },
});

export const Loading = (): unknown => ({
  components: {Chart},
  template: `
    <Chart :points="points" :label="label" :isLoading="loading" />
  `,
  props: {
    points: {
      type: Array,
      default: object('points', points),
    },
    label: {
      type: String,
      default: text('Label', 'event.daily.label')
    },
    loading: {
      type: Boolean,
      default: true,
    }
  },
});
