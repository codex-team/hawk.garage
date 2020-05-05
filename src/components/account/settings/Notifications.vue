<template>
  <div class="acc-notifies">
    <section>
      <h3>Channels</h3>
      <div class="settings-field">
        <div class="settings-field__name">
          Email
        </div>
        <div class="settings-field__description">
          Notifications on specc.dev@gmail.com
        </div>
        <div class="settings-field__input">
          <UiCheckbox
            v-model="form.channels.email.isEnabled"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { User } from '../../../types/user';
import UiCheckbox from './../../forms/UiCheckbox.vue';

export default Vue.extend({
  /**
   * Current user
   */
  user: {
    type: Object as () => User,
    required: true,
  },
});
</script>

<style>
  .acc-notifies {

  }
</style>
