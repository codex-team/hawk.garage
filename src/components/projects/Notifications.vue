<template>
  <div class="project-notifications settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('projects.settings.notifications') }}
    </div>
    <div class="form-section">
      <label class="label form-section__label">Channels</label>
      <div class="form-section__row">
        <div>Email</div>
        <div class="form-section__row__main">
          Notifications on <i>keker@kekas.kek</i>
        </div>
        <Checkbox
          name="email"
          :checked="email"
        />
        {{ email }}
      </div>
      <div class="form-section__row">
        <!--        <FormTextFieldset-->
        <!--          v-model="name"-->
        <!--          class="account-settings__section account-settings__name-section"-->
        <!--          :label="$t('settings.account.name')"-->
        <!--          :placeholder="$t('settings.account.namePlaceholder')"-->
        <!--          @input="showSubmitButton = true"-->
        <!--        />-->
      </div>
    </div>
  </div>
</template>

<script>
import FormTextFieldset from '../forms/TextFieldset';
import Checkbox from '../utils/Checkbox';
import { GET_NOTIFICATION_SETTINGS, UPDATE_NOTIFICATION_SETTINGS } from '../../store/modules/projects/actionTypes';
import notifier from 'codex-notifier';

export default {
  name: 'ProjectNotifications',
  components: {
    FormTextFieldset,
    Checkbox
  },
  data() {
    return {
      email: false
    };
  },
  computed: {
    project() {
      const projectId = this.$route.params.projectId;

      return this.$store.getters.getProjectById(projectId);
    },
    notify() {
      const projectId = this.$route.params.projectId;

      return this.$store.state.settings[projectId];
    }
  },
  created() {
    this.$store.dispatch(GET_NOTIFICATION_SETTINGS, this.$route.params.projectId);
  }
};
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
  .form-section {
    display: block;

    &__label {
      padding-bottom: 20px;
    }

    &__row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__main {
        color: var(--color-text-second);
        font-weight: 500;
        font-size: 13px;
      }
    }
  }

</style>
