<template>
  <div class="guide-section">
    <h2 class="guide-section__header">
      <slot name="header" />
    </h2>
    <div class="guide-section__content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuideSection',
};
</script>

<style>
.guide-section {
  position: relative;
  margin-top: 25px;
  padding: 10px 20px;
  border: solid 1px rgba(219, 230, 255, 0.2);
  border-radius: 5px;

  &__header {
    position: absolute;
    top: 0;
    left: 13px;
    margin: 0;
    padding: 7px;
    font-weight: bold;
    font-size: 18px;
    background-color: var(--color-bg-second);
    transform: translateY(-50%);
  }

  h3 {
    margin: 20px 0 15px 0;
    font-size: 16px;
  }

  p {
    margin: 25px 0 15px 0;
  }
}
</style>
