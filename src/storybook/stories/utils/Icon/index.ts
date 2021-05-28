import Icon from '@/components/utils/Icon.vue';
import { withKnobs } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';

/**
 * Available icons list
 * Injected by Webpack Define Plugin
 */
declare const iconsAvailable: string[];

export default {
  title: 'Utils/Icon',
  component: Icon,
  decorators: [withKnobs, centered],
};

export const Sprite = (): unknown => ({
  components: { Icon },
  template: `
    <div style="
      margin: 10%;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
      grid-template-rows: auto;
      gap: 30px;
      place-items: center;
    ">
      <Icon
        v-for="(icon, index) in icons"
        :symbol="icon"
        :index="index"
        style="height: 20px"
      />
    </div>
  `,
  data() {
    return {
      icons: iconsAvailable,
    };
  },
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
});
