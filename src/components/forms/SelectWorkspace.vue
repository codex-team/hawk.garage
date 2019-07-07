<template>
  <fieldset class="select-workspace">
    <label class="select-workspace__label" for="selectWorkspace">SELECT WORKSPACE</label>
    <div
      class="select-workspace__wrapper"
    >
      <select
        name="workspace"
        id="selectWorkspace"
        class="select-workspace__select"
      >
        <option
          v-for="workspace in workspaces"
          :key="workspace.id"
          :value="workspace.id"
        >
          {{workspace.name}}
        </option>
      </select>
    </div>
  </fieldset>
</template>

<script>
export default {
  name: 'SelectWorkspace',
  props: {
    workspaces: {
      type: Array,
      required: true
    }
  }
};
</script>

<style>
  .select-workspace {
    box-sizing: border-box;
    margin-bottom: 22px;
    padding: 0;
    border: 0;

    &__label {
      display: block;
      margin-bottom: 9px;
      color: var(--color-text-second);
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
    }

    &__select {
      position: relative;
      width: 100%;
      height: 40px;
      padding-left: 12px;
      color: var(--color-text-main);
      font-size: 14px;
      background: var(--color-bg-main);
      border: 1px solid #1f2230;
      border-radius: 3px;
      outline: none;
      appearance: none;

      &::-ms-expand {
        display: none;
      }

      &:focus {
        box-shadow: 0 0 0 1px var(--color-indicator-medium);
      }

      option {
        min-height: 40px;
      }
    }

    &__wrapper {

      position: relative;
      width: 280px;

      &:after {
        position: absolute;
        top: 9px;
        right: 17px;
        display: block;
        width: 12px;
        height: 12px;
        border: 3px solid var(--color-text-main);
        border-bottom: none;
        border-left: none;
        border-radius: 3px;
        transform: rotate(-225deg);
        content: '';
      }
    }
  }
</style>
