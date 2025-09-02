/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{ 
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard',affix: true }
    }]
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/register'),
    hidden: true,
    meta: { requiresAuth: false }
  },

  {
    path: '/detail',
    name: 'Detail',
    component: () => import('@/views/Detail/Detail'),
    hidden: true,
    meta: { requiresAuth: false }
  },

  {
    path: '/change_Password',
    name: 'Change_Password',
    component: () => import('@/views/Change_Password/Change_Password'),
    hidden: true,
    meta: { requiresAuth: false }
  },

  // 心理健康检测结果和历史记录路由（不在导航栏显示）
  {
    path: '/mental-health',
    component: Layout,
    hidden: true, // 隐藏整个菜单组
    children: [
      {
        path: 'result/:id',
        name: 'MentalHealthResult',
        component: () => import('@/views/mental-health/result'),
        meta: { title: '心理健康检测结果', icon: 'el-icon-s-data' }
      },
      {
        path: 'history',
        name: 'MentalHealthHistory',
        component: () => import('@/views/mental-health/history'),
        meta: { title: '心理健康测试历史记录', icon: 'el-icon-time' }
      }
    ]
  },
  
  // 删除这个独立的健康提醒路由
  // {
  //   path: 'healthReminder',
  //   component: () => import('@/views/test/healthReminder'),
  //   name: 'healthReminder',
  //   meta: { title: '健康提醒', icon: 'el-icon-bell' }
  // },
  
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
