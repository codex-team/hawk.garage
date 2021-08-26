<template>
  <div class="repetitions-table">
    <table>
      <!-- Table headings -->
      <tr>
        <th
          v-for="column in columns"
          :key="column"
        >
          {{ getAddonName(column) }}
        </th>
      </tr>

      <!-- Table content -->
      <tr
        v-for="repetition in repetitions"
        :key="repetition.id"
        @click="goToRepetition(repetition.id)"
      >
        <!-- Time (always exists) -->
        <td class="repetitions-table__time">
          {{ repetition.payload.timestamp | prettyTime }}
        </td>

        <!-- User (optional) -->
        <td
          v-if="columns.includes('User')"
          class="repetitions-table__user"
        >
          <EntityImage
            v-if="repetition.payload.user"
            :id="repetition.payload.user ? repetition.payload.user.id : undefined"
            :name="repetition.payload.user ? repetition.payload.user.email : undefined"
            :image="repetition.payload.user ? repetition.payload.user.image : undefined"
            size="22"
            :title="repetition.payload.user.name || $t('event.user.noname')"
          />
        </td>

        <!-- Release (optional) -->
        <td
          class="repetitions-table__release"
          v-if="columns.includes('Release')"
        >
          <code v-if="repetition.payload.release">
            {{ repetition.payload.release }}
          </code>
        </td>

        <!-- Title (exists for the first repetition (original event) and for grouped by Levenshtein distance) -->
        <td
          v-if="columns.includes('Title')"
        >
          {{ repetition.payload.title }}
        </td>

        <!-- ...context fields -->
        <td v-for="contextField in distinctContextKeys">
           {{ repetition.payload.context[contextField] || '—' }}
        </td>

        <!-- ...addons fields -->
        <td v-for="addonsField in distinctAddonsKeys">
          <!-- addons with custom renderers -->
          <component
            :is="customRendererNamePrefix + capitalize(addonsField)"
            v-if="isCustomRenderer(addonsField) && repetition.payload.addons[addonsField]"
            :value="repetition.payload.addons[addonsField]"
          />
          <!-- other addons -->
          <template
            v-else
          >
            <!-- JSON value -->
            <code
              v-if="isObject(repetition.payload.addons[addonsField])"
            >
              &lt;Object&gt;
            </code>

            <!-- String value -->
            <template v-else>
              {{ repetition.payload.addons[addonsField] || '—' }}
            </template>
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import EntityImage from '../utils/EntityImage';
import { EventDataAccepted } from 'hawk.types';
import { EventAddons } from '../../../../types/src/base/event/addons';
import CustomRendererBeautifiedUserAgent from '@/components/event/details/customRenderers/BeautifiedUserAgent.vue';
import CustomRendererWindow from '@/components/event/details/customRenderers/Window.vue';
import AddonRenderers from '../../mixins/addonRenderers.ts';

export default Vue.extend({
  name: 'RepetitionsTable',
  components: {
    EntityImage,
    CustomRendererBeautifiedUserAgent,
    CustomRendererWindow,
  },
  mixins: [
    AddonRenderers
  ],
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
      type: Object as PropType<EventDataAccepted<EventAddons>>,
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
  mounted(){
    this.lockChromeSwipeNavigation(true);
  },
  beforeDestroy() {
    this.lockChromeSwipeNavigation(false);
  },
  computed: {
    /**
     * Unique addons keys
     */
    distinctAddonsKeys(): Set<string>{
      return this.getDistinctKeysRepetitionsProperty('addons');
    },

    /**
     * Unique context keys
     */
    distinctContextKeys(): Set<string>{
      return this.getDistinctKeysRepetitionsProperty('context');
    },

    /**
     * All table columns list
     */
    columns(): string[] {
      let cols = [];

      if (!this.repetitions.length){
        return cols;
      }

      cols.push('Time');

      let releaseSpecifiedSomewhere = false;
      let userSpecifiedSomewhere = false;
      let titleSpecifiedSomewhere = false;

      this.repetitions.forEach(repetition => {
        if (repetition.payload.release) {
          releaseSpecifiedSomewhere = true;
        }

        if (repetition.payload.title) {
          titleSpecifiedSomewhere = true;
        }

        if (repetition.payload.user && repetition.payload.user.name) {
          userSpecifiedSomewhere = true;
        }

        if (titleSpecifiedSomewhere && userSpecifiedSomewhere){
          return;
        }
      });

      if (userSpecifiedSomewhere){
        cols.push('User');
      }

      if (releaseSpecifiedSomewhere){
        cols.push('Release');
      }

      if (userSpecifiedSomewhere){
        cols.push('Title');
      }

      cols.push(...this.distinctAddonsKeys.values())
      cols.push(...this.distinctContextKeys.values())

      return cols;
    }
  },
  methods: {
    /**
     * Returns the Set of distinct keys over several objects
     *
     * @param property — event property to iterate its keys
     */
    getDistinctKeysRepetitionsProperty(property: 'context' | 'addons' ): Set<string>{
      if (!this.repetitions.length){
        return new Set();
      }

      return this.repetitions.reduce((keys, repetition) => {
        if (!repetition.payload[property]){
          return keys;
        }

        Object
          .keys(repetition.payload[property])
          .forEach(key => {
            keys.add(key)
          })

        return keys;
      }, new Set())
    },

/**
     * Provides navigation to the single repetition
     *
     * @param {string} repetitionId - clicked repetition id
     */
    goToRepetition(repetitionId) {
      this.$router.push({
        name: 'event-overview',
        params: {
          projectId: this.projectId,
          eventId: this.event.id,
          repetitionId: repetitionId,
        },
      });
    },

    /**
     * Prevent accidental Chrome's 'two-fingers' swipe navigation on scrolling of repetitions table
     *
     * @param state - true to lock, false to unlock
     */
    lockChromeSwipeNavigation(state){
      document.body.classList.toggle('swipe-nav-disabled', state)
    }
  },
});
</script>

<style>
  .repetitions-table {
    overflow: auto;
    overscroll-behavior-x: none;
    font-size: 14px;

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      white-space: nowrap;
    }

    tr:not(:first-child){
      cursor: pointer;

      &:hover {
        .repetitions-table__time {
          color: var(--color-text-main);
        }
      }
    }

    th,
    td {
      padding: 15px 10px;
      text-align: left;
      border-bottom: 1px solid var(--color-border);

      &:first-child {
        padding-left: 0;
      }
    }

    &__time {
      color: var(--color-text-second);
      letter-spacing: 0.16px;
      width: 40px;
      box-sizing: content-box;
    }

    &__user {
      width: 22px;
    }

    code {
      display: inline-block;
      background: var(--color-bg-main);
      color: var(--color-text-second);
      padding: 4px;
      border-radius: 5px;
      font-weight: 500;
      font-size: 12px;
      font-family: var(--font-monospace);
    }
  }

  body.swipe-nav-disabled{
    overscroll-behavior-x: none;
  }
</style>
