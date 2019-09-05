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
        v-for="(bt, index) in filteredBacktrace"
        :key="index"
        class="event-details__content-block details-backtrace__content-block"
      >
        <div
          class="details-backtrace__header-row"
          @click="toggleViewState(index)"
        >
          <div class="details-backtrace__filename">
            {{ bt.file }}
          </div>
          <div class="details-backtrace__line">
            line {{ bt.line }}
          </div>
          <Icon
            v-if="bt.sourceCode"
            :class="{'details-backtrace__arrow-down--opened': openedFilesView.includes(index) && bt.sourceCode}"
            symbol="arrow-down"
            class="details-backtrace__arrow-down"
          />
        </div>
        <CodeBlock
          v-if="openedFilesView.includes(index) && bt.sourceCode"
          show-lines-numbers
          :lines-from="bt.sourceCode[0].line"
          :highlight-lines="bt.line"
          class="details-backtrace__source-code"
        >
          <pre>{{ joinSourceCodeLines(bt.sourceCode) }}</pre>
        </CodeBlock>
      </div>
    </template>
    <template #expandButton>
      {{ isMoreFilesShown? 'Hide':`${backtrace.length - 3} more files` }}
    </template>
  </DetailsBase>
</template>

<script>
import DetailsBase from './DetailsBase';
import CodeBlock from '../utils/CodeBlock';
import Icon from '../utils/Icon';

export default {
  name: 'DetailsBacktrace',
  components: {
    DetailsBase,
    CodeBlock,
    Icon
  },
  props: {
    /**
     * Event backtrace to show
     */
    backtrace: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      /**
       * Is block expanded.
       */
      isMoreFilesShown: false,
      openedFilesView: []
    };
  },
  computed: {
    /**
     * Displayed backtrace items
     */
    filteredBacktrace() {
      return this.backtrace.length === 4 || this.isMoreFilesShown ? this.backtrace : this.backtrace.slice(0, 3);
    }
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
      if (this.openedFilesView.includes(index)) {
        const itemIndex = this.openedFilesView.indexOf(index);

        this.openedFilesView.splice(itemIndex, 1);
      } else {
        this.openedFilesView.push(index);
      }
    }
  }
};
</script>

<style>
  .details-backtrace {
    &__source-code {
      font-size: 12px;
      line-height: 21px;
      padding: 3px 9px;
      border: none;
      background-color: #171920;
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

    &__filename {
      letter-spacing: -0.3px;
    }

    &__line {
      margin-right: 47px;
      margin-left: auto;
    }
  }
</style>
