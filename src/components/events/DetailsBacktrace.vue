<template>
  <DetailsBase
    class="details-backtrace"
    :expand-showed="backtrace.length !== 4 && backtrace.length > 3"
    @expandClicked="isMoreFilesShown = !isMoreFilesShown"
  >
    <template #header>
      BACKTRACE
    </template>
    <template #content>
      <div
        v-for="(frame, index) in filteredBacktrace"
        :key="index"
        class="event-details__content-block details-backtrace__content-block"
      >
        <div
          class="details-backtrace__header-row"
          @click="toggleViewState(index)"
        >
          <div class="details-backtrace__left">
            <span v-if="frame.function">
              {{ frame.function }}
            </span>
            <span
              v-else
              class="details-backtrace__left-anonymous-function"
            >
              (anonymous function)
            </span>
          </div>
          <div class="details-backtrace__right">
            {{ frame.file }}
            <template v-if="frame.line">
              line {{ getLocation(frame) }}
            </template>
          </div>
          <Icon
            v-if="frame.sourceCode"
            :class="{'details-backtrace__arrow-down--opened': openedFrames.includes(index) && frame.sourceCode}"
            symbol="arrow-down"
            class="details-backtrace__arrow-down"
          />
        </div>
        <CodeFragment
          v-if="openedFrames.includes(index) && frame.sourceCode"
          :lines="frame.sourceCode"
          :lines-highlighted="[frame.line]"
          :column-pointer="frame.column"
          :filename="frame.file"
          :lang="lang"
        />
      </div>
    </template>
    <template #expandButton>
      {{ isMoreFilesShown? 'Hide':`${backtrace.length - 3} more files` }}
    </template>
  </DetailsBase>
</template>

<script>
import DetailsBase from './DetailsBase';
import CodeFragment from '../utils/CodeFragment';
import Icon from '../utils/Icon';

export default {
  name: 'DetailsBacktrace',
  components: {
    DetailsBase,
    CodeFragment,
    Icon,
  },
  props: {
    /**
     * Event backtrace to show
     */
    backtrace: {
      type: Array,
      required: true,
    },

    /**
     * Error environment language
     */
    lang: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      /**
       * Is block expanded.
       */
      isMoreFilesShown: false,

      /**
       * Indexes of opened frames
       */
      openedFrames: [],
    };
  },
  computed: {
    /**
     * Displayed backtrace items
     */
    filteredBacktrace() {
      return this.backtrace.length === 4 || this.isMoreFilesShown ? this.backtrace : this.backtrace.slice(0, 3);
    },
  },
  mounted() {
    /**
     * By default, open first frame that has a source code
     */
    this.openedFrames.push(this.backtrace.findIndex(frame => !!frame.sourceCode));
  },
  methods: {
    /**
     * Join array of source code lines into one string to display it
     * @param {Array} sourceCodeLinesArray - array o source code lines
     * @return {String}
     */
    joinSourceCodeLines(sourceCodeLinesArray) {
      if (sourceCodeLinesArray) {
        return sourceCodeLinesArray.map(sourceCode => sourceCode.content).join('\n');
      }
    },

    /**
     * Switches the state of the spoiler to view the code
     * @param {Number} index - backtrace info index
     */
    toggleViewState(index) {
      if (this.openedFrames.includes(index)) {
        const itemIndex = this.openedFrames.indexOf(index);

        this.openedFrames.splice(itemIndex, 1);
      } else {
        this.openedFrames.push(index);
      }
    },

    /**
     * Return concatenated "line:column" with the necessary checkups
     *
     * @param {number} line - calling line number
     * @param {number} [column] - calling column number
     * @return {string}
     */
    getLocation({ line, column }) {
      let str = line;

      if (!isNaN(parseInt(column))) {
        str += ':' + column;
      }

      return str;
    },
  },
};
</script>

<style>
  .details-backtrace {
    &__source-code {
      padding: 3px 9px;
      font-size: 12px;
      line-height: 21px;
      background-color: #171920;
      border: none;
      border-radius: var(--border-radius);
    }

    &__arrow-down {
      position: absolute;
      top: 50%;
      right: 12px;
      width: 16px;
      height: 16px;
      transform: translateY(-50%);

      &--opened {
        transform: rotate(180deg) translateY(50%);
      }
    }

    &__header-row {
      position: relative;
      display: flex;
      align-items: center;
      padding: 7px;
      font-size: 12px;
      font-family: var(--font-monospace);
      cursor: pointer;
    }

    &__content-block {
      display: flex;
      flex-direction: column;
      padding: 5px;
    }

    &__filename, &__line {
      color: var(--color-text-second);
      font-size: 12px;
      font-family: var(--font-monospace);
    }

    &__left {
      letter-spacing: -0.3px;

      &-anonymous-function{
        opacity: 0.3;
      }
    }

    &__right {
      margin-right: 47px;
      margin-left: auto;
    }
  }
</style>
