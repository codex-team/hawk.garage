<template>
  <div class="event-item-skeleton" >
    <div class="event-item-skeleton__day skeleton-bar" />
    <div
      class="event-item-skeleton-row"
      v-for="i in 10" :key="i"
    >
      <div class="skeleton-bar event-item-skeleton-row__time" />
      <div class="skeleton-bar event-item-skeleton-row__badge-container" />
      <div class="skeleton-bar event-item-skeleton-row__info" />
      <div class="skeleton-bar event-item-skeleton-row__assignee" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventItemSkeleton',

};
</script>

<style>
.skeleton-bar {
  height: 16px;
  background-color: var(--color-bg-third);
  border-radius: 9px;
}

.event-item-skeleton {
  padding-block-start: 26px;

  &__day {
    width: 40px;
    margin-bottom: 26px;
    margin-left: 10px;
  }

  &-row {
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 24px;
    padding-block: 10px;



    &__time {
      min-width: 26px;
      margin-left: 40px;
    }

    &__badge-container {
      min-width: 54px;
      margin-left: 0px;
    }

    &__info {
      width: 40%;
      margin-right: auto;
      margin-left: 26px;
    }

    &__assignee {
      width: 20px;
      margin-right: 14px;
    }
  }
}
</style>
