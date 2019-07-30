<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router @select="handleSelect" active-text-color="#409eff">
        <el-menu-item index="/organizationalStructure">组织架构管理</el-menu-item>
        <el-menu-item index="/person">人员管理</el-menu-item>
        <el-menu-item index="/attendanceStatistics">考勤统计</el-menu-item>
        <el-menu-item index="/attendanceConfiguration">考勤配置</el-menu-item>
        <el-menu-item index="/manage">权限管理</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Theader',
  data () {
    return {
      activeIndex: '/organizationalStructure'
    }
  },
  mounted () {
    console.log(location.hash.substring(1))
    this.activeIndex = location.hash.substring(1)
    // console.log(this.activeIndex)
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath, "key, keyPath")
      this.activeIndex = key
    }
  }
}
</script>

<style scoped>
    .el-menu-demo{
        padding-left: 40px;
    }
</style>
