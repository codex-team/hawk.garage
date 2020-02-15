<template>
  <div
    class="catcher-label"
  >
    {{ itemType.toUpperCase() }}
  </div>
</template>

<script>
export default {
  name: 'CatalogItemLabel',
  props: {
    itemType: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
.catcher-label{
  width: 60px;
  height: 19px;
  color: #ffffff;
  font-weight: 500;
  font-size: 11px;
  line-height: 19px;
  text-align: center;
  background-color: #ed2f85;
  border-radius: 4px;
}
</style>
