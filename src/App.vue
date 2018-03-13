<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:#666;
  background:#fff;
  font-family: Microsoft YaHei,Avenir,Helvetica,Arial,sans-serif;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
ul,li {
  list-style-type: none;
}
</style>
