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
        <td class="repetitions-list__col">
          <span class="repetitions-list__time">{{ repetition.payload.timestamp | prettyTime }}</span>
        </td>
        <td class="repetitions-list__col">
          <span class="repetitions-list__user-name">
            [PICTURE]
            [USER]
            {{ repetition.payload.user ? repetition.payload.user.name : '' }}
          </span>
        </td>
        <td class="repetitions-list__col">
          <span class="repetitions-list__user-browser">
            [BROWSER]
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
        <td class="repetitions-list__col">
          <span class="repetitions-list__url">
            [URL]
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RepetitionsTable',
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
     * @param {number | undefined} width - window inner width
     * @param {number | undefined} height - window inner height
     * @return {string} window size in correct format
     */
    showWindowSize({ innerWidth: width, innerHeight: height }) {
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
  },
};
</script>

<style>
  .repetitions-list {
    &__date {
      margin-bottom: 10px;
      font-size: 14px;
      opacity: 0.6;
    }

    &__table {
      width: 100%;
      margin-left: -10px;
      border-spacing: 0;
    }

    &__row {
      cursor: pointer;
      height: 40px;

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
    }

    &__user-photo {
      width: 24px;
      height: 24px;
      border-radius: 3px;
    }

    &__time {
      width: 40px;
      color: var(--color-text-second);
      letter-spacing: 0.16px;
    }

    &__time,
    &__user-name,
    &__user-browser {
      font-weight: bold;
    }

    &__url {
      color: var(--color-text-second);
    }
  }
</style>
