<template>
  <div class="pp">
    <div class="pp__pic"></div>
    <div class="pp__body">
      <div class="pp__title"></div>
      <div class="pp__desc"></div>
    </div>
    <div class="pp__badge"></div>
  </div>
</template>

<script>
export default {
  name: 'ProjectPlaceholder'
};
</script>

<style scoped>
.pp {
  display: flex;
  padding: 10px 20px;

  &__pic {
    width: 26px;
    height: 26px;
    border-radius: 10px;
    margin-right: 15px;
  }

  &__body {
    flex-grow: 1;
  }

  &__pic,
  &__badge,
  &__title,
  &__desc {
    opacity: 0.07;
    background-color: var(--color-text-main);
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
    border-radius: 7px;
    margin-left: 30px;
    margin-top: 9px;
  }
}
</style>
