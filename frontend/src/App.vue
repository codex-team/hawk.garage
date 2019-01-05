<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="postcss">

@import url("normalize.css");

html {
  height: 100%;
}

body {
  font-family: "Lato", system-ui;
  display: flex;
  align-items: stretch;
  min-height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 15px;
}

#app {
  display: flex;
  align-items: stretch;
  width: 100%;
}

.yard-page {
  width: 100%;
  background: var(--yardBg);
  color: var(--yardGrayText);
  padding: 60px;
  padding-bottom: 20px;
  font-size: 20px;

  @media (--mobile) {
    padding: 15px;
  }
}
</style>
