<template>
  <div id="app">
    <t-header></t-header>
    <router-view/>
  </div>
</template>

<script>
import THeader from '../../components/pc/component/t-header'
export default {
  name: 'App',
  components: {
    THeader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
