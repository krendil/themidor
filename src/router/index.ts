import { createRouter, createWebHistory } from 'vue-router'
import ContrastView from '../views/ContrastView.vue'
import EditView from '../views/EditView.vue'
import TagView from '../views/TagView.vue'
import ExportView from '../views/ExportView.vue'
import ImportView from '../views/ImportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/edit'
    },
    {
      path: '/edit',
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
    {
      path: '/import',
      name: 'import',
      component: ImportView,
    },
  ],
})

export default router
