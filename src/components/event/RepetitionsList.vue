<template>
  <div class="repetitions-list">
    <div class="repetitions-list__date">
      {{ date }}
    </div>

    <table class="repetitions-list__table">
      <tr
        v-for="repetition in repetitions"
        :key="repetition.id"
        class="repetitions-list__row"
        @click="goToRepetition(repetition)"
      >
        <td class="repetitions-list__col repetitions-list__col--fixed-short">
          <span class="repetitions-list__time">
            {{ repetition.payload.timestamp | prettyTime }}
          </span>
        </td>
        <td class="repetitions-list__col repetitions-list__col--fixed-medium">
          <span class="repetitions-list__user">
            <EntityImage
              :id="repetition.payload.user ? repetition.payload.user.id : undefined"
              :name="repetition.payload.user ? repetition.payload.user.email : undefined"
              :image="repetition.payload.user ? repetition.payload.user.image : undefined"
              size="22"
            />
            <span class="repetitions-list__user-name">
              {{ repetition.payload.user ? repetition.payload.user.name || '—' : '' }}
            </span>
          </span>
        </td>
        <td
          v-if="repetition.payload.addons && repetition.payload.addons.userAgent"
          class="repetitions-list__col"
        >
          <span class="repetitions-list__user-browser">
            {{ getBrowser(repetition.payload.addons.userAgent) }}
          </span>
        </td>
        <td class="repetitions-list__col">
          <span
            v-if="repetition.payload.addons && repetition.payload.addons.window"
            class="repetitions-list__user-screen"
          >
            {{ showWindowSize(repetition.payload.addons.window) }}
          </span>
        </td>
        <td class="repetitions-list__col repetitions-list__col--fixed-short">
          <a
            class="repetitions-list__url"
            :title="repetition.payload.addons.url"
            :href="repetition.payload.addons.url"
            @click.stop
          >
            {{ repetition.payload.addons.url }}
          </a>
        </td>
        <template v-if="repetition.payload.context">
          <td
            v-for="([name, value], index) of Object.entries(repetition.payload.context)"
            :key="'context:' + repetition.id + ':' + index"
            class="repetitions-list__col"
          >
            <div class="repetitions-list__context-field">
              {{ name }}
            </div>
            <div class="repetitions-list__context-value">
              {{ value }}
            </div>
          </td>
        </template>
      </tr>
    </table>
  </div>
</template>

<script>
import EntityImage from '../utils/EntityImage';
import { getBrowserByUseragent } from '../../utils';

export default {
  name: 'RepetitionsTable',
  components: {
    EntityImage,
  },
  props: {
    /**
     * List of repetitions
     */
    repetitions: {
      type: Array,
      required: true,
    },

    /**
     * Event that owns passed repetitions
     */
    event: {
      type: Object,
      required: true,
    },

    /**
     * Project that owns the Event
     */
    projectId: {
      type: String,
      required: true,
    },

    /**
     * Day in which repetitions happened
     */
    date: {
      type: String,
      required: true,
    },
  },
  methods: {
    /**
     * Provides navigation to the single repetition
     *
     * @param {Repetition} repetition - clicked repetition
     */
    goToRepetition(repetition) {
      this.$router.push({
        name: 'event-overview',
        params: {
          projectId: this.projectId,
          eventId: this.event.id,
          repetitionId: repetition.id,
        },
      });
    },
    /**
     * Show window size of repeated events
     *
     * @param {object} params - addon data
     * @param {number | undefined} params.innerWidth - window inner width
     * @param {number | undefined} params.innerHeight - window inner height
     * @returns {string} window size in correct format
     */
    showWindowSize({ innerWidth, innerHeight }) {
      let width = innerWidth;
      let height = innerHeight;

      /**
       * As repetition store diff with first-ever event
       * and if window size hasn't changed
       * need to show original proportions
       */
      if (!width) {
        width = this.event.payload.addons.window.innerWidth;
      }

      if (!height) {
        height = this.event.payload.addons.window.innerHeight;
      }

      return width + 'x' + height;
    },

    /**
     * Return browser name and version by useragent
     *
     * @todo Do it on the worker side, see https://github.com/codex-team/hawk.workers/issues/131
     * @param {string} useragent - event userAgent
     * @returns {string}
     */
    getBrowser(useragent) {
      return getBrowserByUseragent(useragent).shift();
    },
  },
};
</script>

<style>
  .repetitions-list {
    &__date {
      margin-bottom: 10px;
      color: var(--color-text-second);
      font-size: 14px
    }

    &__table {
      width: 100%;
      margin-left: -10px;
      border-spacing: 0;
    }

    &__row {
      height: 40px;
      cursor: pointer;

      &:hover {
        background-color: var(--color-bg-sidebar) !important;
      }
    }

    &__row:nth-child(even) {
      background-color: var(--color-bg-main);
    }

    &__col {
      padding: 6px 10px;
      font-size: 13px;

      &--fixed {
        &-short {
          width: 40px;
        }
        &-medium {
          width: 120px;
        }
      }
    }

    &__time {
      color: var(--color-text-second);
      letter-spacing: 0.16px;
    }

    &__user {
      display: inline-flex;
      align-items: center;

      &-name {
        display: inline-block;
        width: 100px;
        margin-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &__url {
      display: inline-block;
      max-width: 150px;
      overflow: hidden;
      color: var(--color-text-second);
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__time,
    &__user,
    &__user-browser {
      font-weight: bold;
    }

    &__context {
      &-field {
        margin-bottom: 2px;
        color: var(--color-text-second);
        font-size: 10px;
      }

      &-value {
        font-size: 12px;
      }
    }
  }
</style>
