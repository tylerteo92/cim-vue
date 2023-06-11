import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import HomeLayout from '../layouts/HomeLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: {
      layout: DashboardLayout,
      public: true,
    },
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not_found_route',
    component: () => import('../pages/Error.vue'),
    meta: {
      layout: HomeLayout,
      public: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
