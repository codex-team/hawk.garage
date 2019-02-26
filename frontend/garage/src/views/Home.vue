<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Hello, World!" />
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';
export default {
  name: 'home',
  components: {
    HelloWorld
  },
  methods: {
  	doSmt: function() {
  		this.axios.get('/api/test')
  			.then(data => {
  				console.log('DATA: ', data);
  			})
  			.catch(err => {
  				console.log('ERROR: ', err);
  			})
	  }
	},
	beforeMount() {
    this.doSmt();
  },
};
</script>
