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
  display: flex;
  height: 23px;
  margin-top: -19px;
  margin-left: 60px;
  background: var(--color-bg-second);
  border: solid 1px var(--color-indicator-positive);
  border-radius: 12.5px;
  outline: none;
  cursor: pointer;
  user-select: none;

  &__text {
    padding: 2px 6px;
    color: var(--color-indicator-positive);
    font-size: 13px;
    letter-spacing: 0.16px;
  }

  &:hover {
    background: var(--color-indicator-positive);
  }

  &:hover &__text {
    color: #fff;
  }
}
</style>
