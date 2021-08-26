<template>
  <fieldset class="fieldset change-password-fieldset">
    <section
      v-if="!showInputs"
    >
      <label class="label change-password-fieldset__label">
        {{ $t('authPages.password') }}
      </label>
      <button
        type="button"
        class="button button--quiet change-password-fieldset__button"
        @click="$emit('update:showInputs', true)"
      >
        <Icon
          class="change-password-fieldset__key-icon"
          symbol="key"
        />
        {{ $t('settings.account.changePassword') }}
      </button>
    </section>
    <template v-if="showInputs">
      <FormTextFieldset
        auto-complete="current-password"
        :value="value.old"
        :label="$t('components.changePasswordFieldSet.oldPassword')"
        type="password"
        @input="oldPasswordInput"
      />
      <FormTextFieldset
        auto-complete="new-password"
        :value="value.new"
        class="change-password-fieldset__new-password"
        :label="$t('components.changePasswordFieldSet.newPassword')"
        type="password"
        @input="newPasswordInput"
      />
    </template>
  </fieldset>
</template>

<script>
import Icon from '../utils/Icon';
import FormTextFieldset from './TextFieldset';

export default {
  name: 'ChangePasswordFieldset',
  components: {
    FormTextFieldset,
    Icon,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    showInputs: Boolean,
  },
  data() {
    return {
      old: '',
      new: '',
    };
  },
  mounted() {
    this.data = this.value;
  },
  methods: {
    oldPasswordInput(value) {
      this.data.old = value;
      this.$emit('input', this.data);
    },

    newPasswordInput(value) {
      this.data.new = value;
      this.$emit('input', this.data);
    },
  },
};
</script>

<style>
  .change-password-fieldset {
    &__label {
      margin-bottom: 9px;
    }

    &__button {
      display: inline-flex;
      align-items: center;
      padding: 9px 17px 9px 10px;
    }

    &__new-password {
      margin-top: 20px;
    }

    &__key-icon {
      width: 14px;
      height: 14px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }
</style>
