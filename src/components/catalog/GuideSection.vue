<template>
  <div class="guide-section">
    <div class="guide-section__header">
      <slot name="header" />
    </div>
    <div class="guide-section__content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideSection'
};
</script>

<style>
.guide-section {
  position: relative;
  margin-top: 84px;
  padding: 20px;
  border: solid 1px rgba(219, 230, 255, 0.2);
  border-radius: 5px;

  &__header {
    position: absolute;
    top: 0;
    left: 13px;
    padding: 7px;
    font-weight: bold;
    font-size: 18px;
    background-color: var(--color-bg-second);
    transform: translateY(-50%);
  }
}
</style>
