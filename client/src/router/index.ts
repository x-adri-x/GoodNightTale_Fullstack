import { createRouter, createWebHistory } from 'vue-router'
import ContentLayout from '@/layouts/ContentLayout.vue'
import { authenticate } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      component: ContentLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../views/HomeView/index.vue'),
        },
      ],
    },
    {
      path: '/tale',
      component: ContentLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Tale',
          component: () => import('../views/TaleView/index.vue'),
        },
      ],
    },
    {
      path: '/book',
      component: ContentLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'StoryBook',
          component: () => import('../views/StoryBook.vue'),
        },
      ],
    },
    {
      path: '/page/:id',
      component: ContentLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Page',
          component: () => import('../views/BookPageView.vue'),
        },
      ],
    },
    {
      path: '/edit/:id',
      component: ContentLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Edit',
          component: () => import('../views/EditView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '',
      name: 'Landing',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: () => import('../views/404.vue'),
    },
  ],
})

export default router
