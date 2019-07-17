<template>
  <div class="project-add-catcher">
    <div class="project-add-catcher__header">
      <div class="project-add-catcher__steps">
        <div class="project-add-catcher__step">
          1
          <Icon
            class="project-add-catcher__tick-icon"
            symbol="tick"
          />
        </div>
        <div class="project-add-catcher__steps-bind" />
        <div class="project-add-catcher__step">
          2
        </div>
      </div>
    </div>
    <div class="project-add-catcher__catcher-catalog" />
  </div>
</template>

<script>
import Icon from '../utils/Icon';

export default {
  name: 'ProjectAddCatcher',
  components: {
    Icon
  }
};
</script>

<style>
.project-add-catcher {
  &__header {
    padding-top: 80px;
    background-image: radial-gradient(circle at 52% 3%, #313748, var(--color-bg-main));
  }

  &__steps {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__step {
    width: 35px;
    height: 35px;
    font-weight: bold;
    line-height: 32px;
    text-align: center;
    border: 2px solid var(--color-text-second);
    border-radius: 50%;

    &:first-child {
      position: relative;
      color: var(--color-text-second);
      border: 2px solid var(--color-text-second);
    }

    &:last-child {
      border: 2px solid var(--color-text-main);
    }
  }

  &__steps-bind {
    margin: 0 26px;
    width: 153px;
    height: 1px;
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(to right, #939baf, var(--color-text-main));
    border-image-slice: 1;
  }

  &__tick-icon {
    position: absolute;
    right: -17px;
    bottom: -4px;
    width: 28px;
    height: 28px;
    padding:6px;
    color: var(--color-text-main);
    background-color: #2ccf6c;
    border-radius: 100%;
  }
}
</style>
