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
import Badge from '../Badge';

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
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    max-height: 62px;
    padding: 6px 20px;

    color: var(--color-text-main);

    cursor: pointer;

    user-select: none;

    &__name {
      margin-bottom: 5px;

      color: var(--color-text-main);
      font-weight: 500;
      font-size: 14px;
    }

    &__last-event {
      display: -webkit-box;
      width: 206px;
      height: 30px;
      overflow: hidden;

      color: var(--color-text-second);
      font-size: 12.6px;
      line-height: 1.27;
      letter-spacing: 0.1px;

      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &__picture {
      width: 26px;
      height: 26px;
      margin-right: 15px;

      background-position: center;
      background-size: cover;
      border-radius: 10px;
    }

    &__events-number {
      margin: auto 0 auto auto;
    }

    &:hover {
      background-color: var(--color-bg-second);
    }
  }
</style>
