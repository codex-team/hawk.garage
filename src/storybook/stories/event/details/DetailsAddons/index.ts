import DetailsAddons from '@/components/event/details/DetailsAddons.vue';
import { withKnobs, text } from '@storybook/addon-knobs';
import centered from '@/storybook/decorators/centered';
import { EventAddons } from '@hawk.so/types';
import { PropType } from 'vue';

export default {
  title: 'Event/Details/JavaScript',
  component: [ DetailsAddons ],
  decorators: [withKnobs, centered],
};

const userAgentData = {
  os: 'Mac OS X',
  osVersion: '10.1.2',
  browser: 'Safari',
  browserVersion: '1.2.3',
};

export const BeautifiedUserAgent = (): unknown => ({
  components: { DetailsAddons },
  template: `
    <div style="background: #2f3341; padding: 30px; border-radius: 5px">
      <details-addons :addons="addons"/>
      <br>
      <details-addons :addons="addonsWindows"/>
      <br>
      <details-addons :addons="addonsLinux"/>
      <br>
      <details-addons :addons="addonsIos"/>
      <br>
      <details-addons :addons="addonsAndroid"/>
      <br>
      <details-addons :addons="addonsChrome"/>
      <br>
      <details-addons :addons="addonsOpera"/>
      <br>
      <details-addons :addons="addonsVivaldi"/>
      <br>
      <details-addons :addons="addonsFirefox"/>
      <br>
      <details-addons :addons="addonsEdge"/>
      <br>
      <details-addons :addons="addonsYandex"/>
    </div>
  `,
  props: {
    addons: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
        },
      },
    },
    addonsWindows: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          os: 'Windows',
        },
      },
    },
    addonsLinux: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          os: 'Linux',
        },
      },
    },
    addonsIos: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          os: 'iOS',
        },
      },
    },
    addonsAndroid: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          os: 'Android',
          browser: 'Chrome',
        },
      },
    },
    addonsChrome: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          browser: 'Chrome',
        },
      },
    },
    addonsOpera: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          browser: 'Opera',
        },
      },
    },
    addonsVivaldi: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          browser: 'Vivaldi',
        },
      },
    },
    addonsFirefox: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          browser: 'Firefox',
        },
      },
    },
    addonsEdge: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          browser: 'Edge',
        },
      },
    },
    addonsYandex: {
      type: Object as PropType<EventAddons>,
      default: {
        beautifiedUserAgent: {
          ...userAgentData,
          browser: text('Last: browser name', 'YaBrowser'),
          os: text('Last: os name', 'Windows'),
        },
      },
    },
  },
});
