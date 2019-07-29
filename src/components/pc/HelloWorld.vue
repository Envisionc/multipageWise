<template>
  <div class="pc">
    <t-header></t-header>
    <router-view></router-view>
  </div>
</template>

<script>
import THeader from '../../components/pc/component/t-header'
export default {
  name: 'HelloWorld',
  components: {
    THeader
  },
  data () {
    return {
      msg: 'HelloWorld,I am PC'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
