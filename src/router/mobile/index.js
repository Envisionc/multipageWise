import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/mobile/HelloWorld'
// import MobilePage from '@/components/mobile/mobilePage'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/mobile_attendance',
      redirect: '/attendanceInfo'
    },
    // 考勤信息显示
    {
      path: '/attendanceInfo',
      meta: {
        title: '考勤信息显示'
      },
      component: () => import("../../components/mobile/home")
    },
  ]
})

/**
 * 验证
 */
router.beforeEach((to, from, next) => {
  if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = '/p_index.html#/'
    return
  }
  next()
})

export default router
