import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  /*{ path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },*/

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/jinke',
    component: Layout,
    redirect: '/jinke/community',
    name: 'Jinke',
    meta: { title: '金科数据', icon: 'example' },
    children: [
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/views/community/jk_community'),
        meta: { title: '小区管理', icon: 'table' }
      },
      {
        path: 'building',
        name: 'Building',
        component: () => import('@/views/building/jk_building'),
        meta: { title: '楼栋管理', icon: 'chart' }
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/unit/jk_unit'),
        meta: { title: '单元管理', icon: 'unit' }
      },
      {
        path: 'house',
        name: 'House',
        component: () => import('@/views/house/jk_house'),
        meta: { title: '房屋管理', icon: 'house' }
      }
    ]
  },

  {
    path: '/ajb',
    component: Layout,
    redirect: '/ajb/community',
    name: 'Ajb',
    meta: { title: '安居宝小区', icon: 'example' },
    children: [
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/views/community/ajb_community'),
        meta: { title: '小区管理', icon: 'table' }
      },
      {
        path: 'building',
        name: 'Building',
        component: () => import('@/views/building/ajb_building'),
        meta: { title: '楼栋管理', icon: 'chart' }
      },
      {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/unit/ajb_unit'),
        meta: { title: '单元管理', icon: 'unit' }
      },
      {
        path: 'house',
        name: 'House',
        component: () => import('@/views/house/ajb_house'),
        meta: { title: '房屋管理', icon: 'house' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  base: '/VueTest',
  routes: constantRouterMap
})

