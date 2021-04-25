import CircleProgress from '@/components/utils/CircleProgress.vue';

export default {
  title: 'Utils/CircleProgress',
  component: CircleProgress
};

export const Progress = (): unknown => ({
  components: { CircleProgress },
  template: `
    <CircleProgress
      style="margin: auto;"
      :current=63
      :max=100
      :width="100"
      :height="100"
      :stroke-width="5"
    />
  `,
});
