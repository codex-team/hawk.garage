<template>
  <div
    class="ui-button"
    @click="emit('click')"
  >
    <Icon
      v-if="icon"
      class="ui-button-icon"
      :class="'ui-button-icon-' + icon"
      :symbol="icon"
    />
    <span class="ui-button-text">{{ content }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Icon from './Icon.vue';

export default Vue.extend({
  name: 'UiButton',
  components: {
    Icon,
  },
  props: {
    /**
     * Button content
     */
    content: {
      type: String,
      default: '',
    },

    /**
     * Will icon show or not
     */
    icon: {
      type: String,
      default: '',
    },
  },
});
</script>

<style>
 .ui-button {
   display: flex;
   align-items: center;
   padding: 6px 7px;
   border: solid 1px color-mod(var(--color-text-main) alpha(10%));
   color: var(--color-text-second);
   border-radius: 4px;
   cursor: pointer;
   user-select: none;

   &:hover {
     color: var(--color-text-main);
   }

   &-icon {
     width: 15px;
     height: 14px;
     margin-right: 5px;
   }

   &-text {
     font-weight: 500;
     font-size: 14px;
   }
 }
</style>
