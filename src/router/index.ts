import { createRouter, createWebHistory } from 'vue-router'
import ContrastView from '../views/ContrastView.vue'
import EditView from '../views/EditView.vue'
import TagView from '../views/TagView.vue'
import ExportView from '../views/ExportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'edit',
      component: EditView,
    },
    {
      path: '/contrast',
      name: 'contrast',
      component: ContrastView,
    },
    {
      path: '/tag',
      name: 'tag',
      component: TagView,
    },
    {
      path: '/export',
      name: 'export',
      component: ExportView,
    },
  ],
})

export default router
