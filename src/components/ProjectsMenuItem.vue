<template>
  <div
    class="project-menu-item"
  >
    <div
      class="project-menu-item__picture"
      :style="{ backgroundImage: `url('${project.picture}')` }"
    ></div>
    <div class="project-menu-item__info">
      <div class="project-menu-item__name">
        {{project.name}}
      </div>
      <div class="project-menu-item__last-event">
        Uncaught TypeError: Cannot read property 'activate' of undefined фвцфцвфцвфцв
      </div>
    </div>
    <Badge
      content="343"
      class="project-menu-item__events-number"
    ></Badge>
  </div>
</template>

<script>
import Badge from './Badge';

export default {
  name: 'ProjectsMenuItem',
  props: {
    /**
     * @type {Project}
     */
    project: Object
  },
  components: {
    Badge
  }
};
</script>

<style>
  .project-menu-item {
    cursor: pointer;
    user-select: none;
    color: var(--color-text-main);
    max-height: 62px;
    padding: 6px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;

    &__name {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-main);
      margin-bottom: 5px;
    }

    &__last-event {
      font-size: 12.6px;
      line-height: 1.27;
      height: 30px;
      letter-spacing: 0.1px;
      color: var(--color-text-second);
      width: 206px;

      -webkit-line-clamp: 2;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    &__picture {
      width: 26px;
      height: 26px;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
      margin-right: 15px;
    }

    &__events-number {
      margin: auto 0 auto auto;
    }

    &:hover {
      background-color: var(--color-bg-second);
    }
  }
</style>
