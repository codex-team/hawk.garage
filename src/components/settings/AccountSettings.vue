<template>
  <div class="account-settings">
    <div class="account-settings__title">
      Account Settings
    </div>
    <form>
      <div class="account-settings__inline-elements">
        <FormTextFieldset
          class="account-settings__section account-settings__name-section"
          label="Name"
          placeholder="Elon Musk"
          :value="user.name"
          @input="showSubmitButton = true"
        />
        <section>
          <label class="label account-settings__label">Profile picture</label>
          <FormImageUploader @change="showSubmitButton = true" />
        </section>
      </div>
      <FormTextFieldset
        class="account-settings__section"
        label="Email"
        :value="user.email"
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
        Save
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

export default {
  name: 'AccountSettings',
  components: { ChangePasswordFieldset, FormImageUploader, FormTextFieldset },
  data() {
    return {
      showSubmitButton: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user.data;
    }
  }
};
</script>

<style>
.account-settings {
  width: 100%;

  &__title {
    margin-bottom: 30px;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 18px;
  }

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
