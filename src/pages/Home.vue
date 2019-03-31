<template>
  <div class="home">
  </div>
</template>

<script>

export default {
  name: 'Home',
  methods: {
    doSmt: function () {
      this.axios.get('/api/test')
        .then(data => {
          console.log('DATA: ', data);
        })
        .catch(err => {
          console.log('ERROR: ', err);
        });
    }
  },
  beforeMount() {
    this.doSmt();
  }
};

</script>
