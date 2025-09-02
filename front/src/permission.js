import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import Layout from '@/layout'


NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/register','/change_Password'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')

          // 路由转换
          let myRoutes = myFilterAsyncRoutes(store.getters.menuList);
          // 404
          myRoutes.push({
              path: '*',
              redirect: '/404',
              hidden: true
          });
          // 动态添加路由
          router.addRoutes(myRoutes);
          // 存至全局变量
          global.myRoutes = myRoutes;
          // 防止刷新后页面空白
          next({...to,replace:true})  

        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})



function myFilterAsyncRoutes(menuList) {
  menuList.filter(menu => { // 对menuList数组进行过滤操作
    if (menu.component === 'Layout') { // 如果menu的component属性为'Layout'
      menu.component = Layout // 则将其赋值为Layout组件
      // console.log(menu.component); // 打印出menu的component属性
    } else {
      menu.component = require(`@/views/${menu.component}.vue`).default // 否则，根据menu的component属性动态加载对应的vue组件
    }
    // 递归处理子菜单
    if (menu.children && menu.children.length) { // 如果menu有子菜单，且子菜单数组长度大于0
      menu.children = myFilterAsyncRoutes(menu.children) // 则递归调用myFilterAsyncRoutes函数对子菜单进行处理
    }
    return true // filter函数返回true，使得menu能够被保留在新的数组中
  })
  return menuList; // 返回已处理好的菜单数组
}

