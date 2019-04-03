<template>
  <div class="home">
  </div>
</template>

<script>
import * as consts from '@/constants/LocalStorageKeys';

export default {
  name: 'Home',
  data() {
    return {
      projects: []
    };
  },
  methods: {
    doSmt: function () {
      this.axios.get('/api/test')
        .then(data => {
          console.log('DATA: ', data);
        })
        .catch(err => {
          console.log('ERROR: ', err);
        });
    },

    loadProjects: function () {
      let tmpProjects;

      if (!navigator.onLine) {
        this.$api.testStub().then(data => {
          this.projects = this.projects.concat(data.projects);
          localStorage.setItem(consts.PROJECTS_KEY, JSON.stringify(data.projects));
        });
      } else {
        try {
          tmpProjects = JSON.parse(localStorage.getItem(consts.PROJECTS_KEY));
        } catch (err) {
          tmpProjects = [];
        }

        this.projects = this.projects.concat(tmpProjects);
      }
    }
  },
  beforeMount() {
    // this.doSmt();
    this.loadProjects();
  }
};

</script>
