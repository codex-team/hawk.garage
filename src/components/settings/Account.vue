<template>
  <div class="account-settings settings-window-page">
    <div class="settings-window-page__title">
      {{ $t('settings.account.title') }}
    </div>
    <form @submit.prevent="save">
      <div class="account-settings__inline-elements">
        <FormTextFieldset
          v-model="name"
          class="account-settings__section account-settings__name-section"
          :label="$t('settings.account.name')"
          placeholder="Elon Musk"
          @input="showSubmitButton = true"
        />
        <section>
          <label class="label account-settings__label">{{ $t('settings.account.profileImage') }}</label>
          <FormImageUploader @change="showSubmitButton = true" />
        </section>
      </div>
      <FormTextFieldset
        v-model="email"
        class="account-settings__section"
        :label="$t('settings.account.email')"
        @input="showSubmitButton = true"
      />
      <ChangePasswordFieldset
        class="account-settings__section"
        @click.native="showSubmitButton = true"
      />
      <button
        v-if="showSubmitButton"
        class="button button--submit account-settings__submit-button"
      >
        {{ $t('settings.account.submit') }}
      </button>
    </form>
    <hr class="account-settings__horizontal-rule">
    <div class="account-settings__registered-info">
      Registered at Aug 25, 2019
    </div>
  </div>
</template>

<script>
import FormTextFieldset from '../forms/TextFieldset';
import FormImageUploader from '../forms/ImageUploader';
import ChangePasswordFieldset from '../forms/ChangePasswordFieldset';
import { FETCH_CURRENT_USER, UPDATE_PROFILE } from '../../store/modules/user/actionTypes';

export default {
  name: 'AccountSettings',
  components: { ChangePasswordFieldset, FormImageUploader, FormTextFieldset },
  data() {
    return {
      name: this.$store.state.user.data.name,
      email: this.$store.state.user.data.email,
      showSubmitButton: false
    };
  },
  methods: {
    /**
     * Form submit event handler
     */
    async save() {
      try {
        await this.$store.dispatch(UPDATE_PROFILE, { name: this.name, email: this.email });
        await this.$store.dispatch(FETCH_CURRENT_USER);
      } catch (e) {
        this.message = {
          text: e.message,
          type: 'error'
        };
      }
    }
  }
};
</script>

<style src="../../styles/settings-window-page.css"></style>

<style>
.account-settings {
  width: 100%;

  &__inline-elements {
    display: flex;
  }

  &__label {
    margin-bottom: 9px;
  }

  &__section {
    max-width: 280px;
  }

  &__section,
  &__submit-button {
    margin: 0 0 20px 0;
  }

  &__name-section {
    width: 280px;
    margin-right: 30px;
  }

  &__horizontal-rule {
    margin-top: 0;
    margin-bottom: 20px;
    border: 1px solid var(--color-text-second);
    opacity: 0.1;
  }

  &__registered-info {
    color: var(--color-text-second);
    font-size: 13px;
  }
}
</style>
