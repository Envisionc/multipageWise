import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/pc/HelloWorld'
import organizationa from '../../components/pc/organizationalStructureManagement/newOrgStr'

Vue.use(Router)

let router = new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // },
    // {
    //   path: '/p_index.html#/',
    //   redirect: '/organizational'
    // },
    // ../../components/pc/organizationalStructureManagement/organizational
    
    // 人员管理
    {
      path: '/person',
      meta: {
        title: '人员管理'
      },
      component: () => import("../../components/pc/personnelManagement/person")
    },
    {
      path: '/organizationalStructure',
      meta: {
        title: '组织架构管理'
      },
      component: organizationa
    },
    // 统计 attendanceStatistics
    {
      path: '/attendanceStatistics',
      meta: {
        title: '考勤统计'
      },
      component: () => import("../../components/pc/attendanceStatistics/attendanceStatistics")
    }
  ]
})

/**
 * 判断是否为移动设备，是，则跳转到移动端的路径
 */
router.beforeEach((to, from, next) => {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = '/m_index.html#/'
    return
  }
  next()
})

export default router
