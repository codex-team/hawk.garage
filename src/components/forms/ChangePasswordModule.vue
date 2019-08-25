<template>
  <div class="change-password-module">
    <section
      v-if="!showInputs"
      @click="showInputs = true"
    >
      <label class="label change-password-module__label">
        PASSWORD
      </label>
      <button class="button button--quiet change-password-module__button">
        <Icon
          class="change-password-module__key-icon"
          symbol="key"
        />
        Change password
      </button>
    </section>
    <template v-if="showInputs">
      <FormTextFieldset
        class="change-password-module__section"
        label="Old password"
        type="password"
      />
      <FormTextFieldset
        class="change-password-module__section"
        label="New password"
        type="password"
      />
    </template>
  </div>
</template>

<script>
import Icon from '../utils/Icon';
import FormTextFieldset from './TextFieldset';
export default {
  name: 'ChangePasswordButton',
  components: { FormTextFieldset, Icon },
  data() {
    return {
      showInputs: false
    };
  }
};
</script>

<style>
  .change-password-module {
    &__section {
      margin-bottom: 20px;
    }

    &__label {
      margin-bottom: 9px;
    }

    &__button {
      display: inline-flex;
      align-items: center;
      padding: 9px 17px 9px 10px;
    }

    &__key-icon {
      width: 14px;
      height: 14px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }
</style>
