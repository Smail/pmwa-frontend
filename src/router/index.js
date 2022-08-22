import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    alias: ['/home'],
  },
  {
    path: '/signin',
    name: 'signin',
    alias: '/login',
    component: () => import('../views/SignInView.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    alias: '/register',
    component: () => import('../views/SignUpView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { needsAuthentication: true },
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    meta: { needsAuthentication: true },
    component: () => import('../views/CalendarView.vue')
  },
  {
    path: '/todo',
    name: 'todo',
    meta: { needsAuthentication: true },
    component: () => import('../views/TodoView.vue')
  },
  {
    path: '/flashcards',
    name: 'flashcards',
    meta: { needsAuthentication: true },
    component: () => import('../views/FlashcardsView.vue')
  },
  {
    path: '/projects',
    name: 'projects',
    meta: { needsAuthentication: true },
    component: () => import('../views/ProjectsView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { needsAuthentication: true },
    component: () => import('../views/SettingsView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (!to.meta.needsAuthentication || store.state.isLoggedIn) next();
  else next({ name: 'signin' });
});

export default router
