<template>
  <div class="pp">
    <div class="pp__pic" />
    <div class="pp__body">
      <div class="pp__title" />
      <div class="pp__desc" />
    </div>
    <div class="pp__badge" />
  </div>
</template>

<script>
export default {
  name: 'ProjectPlaceholder',
};
</script>

<style scoped>
.pp {
  display: flex;
  padding: 10px 20px;

  &__pic {
    width: 26px;
    height: 26px;
    margin-right: 15px;
    border-radius: 10px;
  }

  &__body {
    flex-grow: 1;
  }

  &__pic,
  &__badge,
  &__title,
  &__desc {
    background-color: var(--color-text-main);
    opacity: 0.07;
  }

  &__title,
  &__desc {
    height: 8px;
    border-radius: 4px;
  }

  &__title {
    width: 50%;
    margin: 5px 0 12px;
  }

  &__badge {
    width: 40px;
    height: 20px;
    margin-top: 9px;
    margin-left: 30px;
    border-radius: 7px;
  }
}
</style>
