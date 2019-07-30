import Vue from 'vue'
import Router from 'vue-router'
import organizationa from '../../components/pc/organizationalStructureManagement/newOrgStr'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/pc_attendance',
      redirect: '/organizationalStructure'
    },
    // 组织架构管理
    {
      path: '/organizationalStructure',
      meta: {
        title: '组织架构管理'
      },
      component: organizationa
    },
    // 人员管理
    {
      path: '/person',
      meta: {
        title: '人员管理'
      },
      component: () => import("@/components/pc/personnelManagement/person")
    },
    {
      path: '/person/batchImport',
      meta: {
        title: '人员导入'
      },
      component: () => import("@/components/pc/personnelManagement/batchImport")
    },
    {
      path: '/person/personDetail',
      meta: {
        title: '人员详情'
      },
      component: () => import("@/components/pc/personnelManagement/personDetail")
    },
    {
      path: '/person/personEdit',
      meta: {
        title: '人员编辑'
      },
      component: () => import("@/components/pc/personnelManagement/personEdit")
    },
    // 考勤统计 attendanceStatistics
    {
      path: '/attendanceStatistics',
      meta: {
        title: '考勤统计'
      },
      component: () => import("@/components/pc/attendanceStatistics/attendanceStatistics")
    },
    // 考勤配置
    {
      path: '/attendanceConfiguration',
      meta: {
        title: '考勤配置'
      },
      component: () => import("@/components/pc/attendanceConfiguration/attendanceConfiguration")
    },
    {
      path: '/attendance/addAttendance',
      meta: {
        title: '新增考勤组'
      },
      component: () => import("@/components/pc/attendanceConfiguration/addAttendance")
    },
    {
      path: '/attendance/addAttendDetail',
      meta: {
        title: '考勤组详情'
      },
      component: () => import("@/components/pc/attendanceConfiguration/addAttendDetail")
    },  
    {
      path: '/attendance/editAttendance',
      meta: {
        title: '编辑考勤项'
      },
      component: () => import("@/components/pc/attendanceConfiguration/editAttendance")
    },
    // 权限管理
    {
      path: '/manage',
      meta: {
        title: '编辑考勤项'
      },
      component: () => import("@/components/pc/accessControl/accessControl")
    },
    {
      path: '/manage/addControl',
      meta: {
        title: '新增人员权限'
      },
      component: () => import("@/components/pc/accessControl/addControl")
    },
    {
      path: '/manage/editControl',
      meta: {
        title: '编辑'
      },
      component: () => import("@/components/pc/accessControl/editControl")
    },
    {
      path: '/manage/detailControl',
      meta: {
        title: '详情'
      },
      component: () => import("@/components/pc/accessControl/detailControl")
    },
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
