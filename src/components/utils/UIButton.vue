<template>
  <div
    class="ui-button"
    @click="$emit('click')"
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
  name: 'UIButton',
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
   border: solid 1px var(--color-bg-main);
   border-radius: 4px;
   cursor: pointer;
   user-select: none;

   &-icon {
     width: 15px;
     height: 14px;
     margin-right: 8px;
     opacity: 0.6;
   }

   &-icon-hided {
     width: 15px;
     height: 12px;
     margin: 2px 4px 0 1px;
   }

   &-text {
     font-weight: 500;
     font-size: 14px;
     opacity: 0.6;
   }

   &:hover &-text, &:hover &-icon,
   &:focus &-text, &:focus &-icon {
    opacity: 1;
   }
 }
</style>
