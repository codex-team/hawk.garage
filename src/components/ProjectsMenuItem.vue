<template>
  <div
    class="project-menu-item"
  >
    <div
      class="project-menu-item__picture"
      :style="{ backgroundImage: `url('${project.picture}')` }"
    ></div>
    <div class="project-menu-item__name">
      {{project.name}}
    </div>
    <div class="project-menu-item__last-event">
      Uncaught TypeError: Cannot read property 'activate' of undefined
    </div>
    <div class="project-menu-item__events-number">
      343
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectsMenuItem',
  props: {
    /**
     * @type {Project}
     */
    project: Object
  }
};
</script>

<style>
  .project-menu-item {
    color: var(--color-text-main);
    max-height: 62px;
    padding: 6px 20px;
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;

    &__name {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-main);
    }

    &__last-event {
      font-size: 12.6px;
      line-height: 1.27;
      letter-spacing: 0.1px;
      color: var(--color-text-second);
      width: 206px;
    }

    &__picture {
      width: 26px;
      height: 26px;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
      flex-basis: 100%;
      margin-bottom: 36px;
      margin-right: 15px;
    }

    &__events-number {
      /*margin-left: 15px;*/
      max-width: 42px;
      background-color: var(--color-indicator-medium);
      border-radius: 7px;
      padding: 4px 7px 3px 7px;
      font-size: 11px;
      /*margin-left: auto;*/
      align-self: flex-end;
    }
  }
</style>
