<template>
  <span class="a-counter">
    <span
      v-if="prevValue !== null"
      class="a-counter__prev"
    >
      {{ prevValue }}
    </span>
    <span
      v-if="curValue !== null"
      class="a-counter__cur"
    >
      {{ curValue }}
    </span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    /**
     * Passed value for animating
     */
    value: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      /**
       * Previous value to jump out
       */
      prevValue: 0 as string | number | null,

      /**
       * Current value to jump in
       */
      curValue: 0 as string | number | null,
    };
  },
  watch: {
    value(newValue, oldValue) {
      this.prevValue = null;
      this.curValue = null;

      setTimeout(() => {
        this.prevValue = oldValue;
        this.curValue = newValue;
      }, 10);
    },
  },
  created(): void {
    this.curValue = this.value;
  },
});
</script>

<style>
  .a-counter {
    position: relative;
    display: inline-block;
    min-width: 7px;
    height: 1em;

    &__prev,
    &__cur {
      will-change: transform, opacity;
    }

    &__prev {
      position: absolute;
      animation: prev-out 500ms ease forwards;
    }

    &__cur {
      position: relative;
      display: inline-block;
      animation: cur-in 500ms ease forwards;
    }
  }

  @keyframes cur-in {
    from {
      transform: translateY(-5px);
      opacity: 0;
    }

    to {
      transform: none;
      opacity: 1;
    }
  }

  @keyframes prev-out {
    from {
      transform: none;
      opacity: 1;
    }

    to {
      transform: translateY(5px);
      opacity: 0;
    }
  }
</style>
