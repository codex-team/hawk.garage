<template>
  <div class="project-add-catcher">
    <div class="project-add-catcher__header">
      <div class="project-add-catcher__steps">
        <div class="project-add-catcher__step">
          1
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
export default {
  name: 'ProjectAddCatcher'
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
    line-height: 35px;
    text-align: center;
    border: 1px solid var(--color-text-second);
    border-radius: 50%;

    &:first-child {
      border: 1px solid var(--color-text-second);
      color: var(--color-text-second);
    }

    &:last-child {
      border: 1px solid var(--color-text-main);
    }
  }

  &__steps-bind {
    width: 153px;
    height: 1px;
    border-style: solid;
    border-width: 1px;
    border-image-source: linear-gradient(to right, #939baf, var(--color-text-main));
    border-image-slice: 1;
  }
}
</style>
