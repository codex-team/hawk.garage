<template>
  <div class="grid-form">
    <section class="grid-form__section">
      <div class="grid-form__section-name">
        Where to receive
      </div>
      <div class="grid-form__section-content">
        <section>
          <FormTextFieldset
            :label="$t('projects.settings.notifications.email')"
            name="email"
            :description="$t('projects.settings.notifications.emailDescription')"
            placeholder="alerts@yourteam.org"
          />
        </section>
      </div>
    </section>
    <section class="grid-form__section">
      <div class="grid-form__section-name">
        What to receive
      </div>
      <div class="grid-form__section-content">
        <section>
          <RadioButtonGroup
            name="receiveType"
            :options="receiveTypes"
            v-model="form.receiveType"
          />
        </section>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FormTextFieldset from './../../forms/TextFieldset.vue';
import RadioButtonGroup from './../../forms/RadioButtonGroup.vue';

export default Vue.extend({
  name: 'ProjectSettingsNotificationsAddRule',
  components: {
    FormTextFieldset,
    RadioButtonGroup,
  },
  data() {
    return {
      form: {
        channels: null,
        receiveType: 'all',
      },
      receiveTypes: [
        {
          id: 'all',
          label: this.$t('projects.settings.notifications.receiveNewLabel'),
          description: this.$t('projects.settings.notifications.receiveNewDescription'),
        },
        {
          id: 'onlyNew',
          label: this.$t('projects.settings.notifications.receiveAllLabel'),
          description: this.$t('projects.settings.notifications.receiveAllDescription'),
        },
      ],
    };
  },
});
</script>

<style>
  .grid-form {
    &__section {
      &:not(:first-of-type){
        margin-top: 50px;
      }

      display: flex;

      &-name {
        width: 120px;
        margin-right: 60px;
        font-size: 15px;
        letter-spacing: 0.19px;
      }
    }
  }
</style>
