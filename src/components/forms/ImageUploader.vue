<template>
  <div class="form-image-uploader">
    UPLOAD LOGO
  </div>
</template>

<script>
export default {
  name: 'FormImageUploader'
};
</script>

<style>
  .form-image-uploader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 60px;
    height: 60px;
    color: var(--color-text-second);
    font-weight: bold;
    font-size: 10px;
    line-height: 1.3;
    text-align: center;
    border: 1px dashed var(--color-text-second);
    border-radius: 10px;
    user-select: none;
  }
</style>
