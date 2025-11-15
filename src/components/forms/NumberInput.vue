<template>
  <input
    type="number"
    :value="value"
    @input="handleInput"
    @beforeinput="handleBeforeInput"
    @paste="handlePaste"
    ref="input"
  />
</template>

<script>
export default {
  name: 'NumberInput',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    // max: {
    //   type: Number,
    //   default: Infinity,
    // },
    // min: {
    //   type: Number,
    //   default: 0,
    // },
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value);
    },
    handleBeforeInput(event) {
      if (event.data.match(/[^0-9]/)) {
        event.preventDefault();
      }

      // const currentValue = this.value;

      // this.$emit('input', newValue);
    },
    handlePaste(event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('text');

      /**
       * Remove all non-numeric characters from the pasted data
       * and set the value to the input
       */
      const numericData = pastedData.replace(/[^0-9]/g, '');
      const currentValue = this.value;
      const newValue = currentValue + numericData;

      /**
       * Set the value to the input
       */
      this.$emit('input', newValue);
      event.preventDefault();
    },
  },
}
</script>

<style scoped>

</style>
