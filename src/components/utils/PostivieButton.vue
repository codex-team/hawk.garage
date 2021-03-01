<template>
  <div>
    <button
      class="boostButton"
      @click="$emit('click', $event)"
    >
      <span class="boostButton__text">
        {{ content }}
      </span>
    </button>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'BoostButton',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
});

</script>

<style>

.boostButton {
  width: 65px;
  height: 23px;
  margin-top: -19px;
  background: var(--color-bg-main);
  border: solid 1px var(--color-indicator-positive);
  border-radius: 12.5px;
  user-select: none;
  outline: none;
  display: flex;
  margin-left: 60px;

  &__text {
    color: var(--color-indicator-positive);
    font-size: 13px;
    letter-spacing: 0.16px;
    padding: 3px 6px 3px 6px;
  }
}
</style>
