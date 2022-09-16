import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "../store";
import { hasValidRefreshToken } from "@/services/hasValidRefreshToken";
import { logErrorAndAlert } from "@/util/logErrorAndAlert";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    alias: ["/home"],
  },
  {
    path: "/signin",
    name: "signin",
    alias: "/login",
    component: () => import("../views/SignInView.vue"),
  },
  {
    path: "/sign-out",
    name: "sign-out",
    alias: "/logout",
    redirect: to => {
      // Redirect to sign in screen
      return { name: 'signin' }
    },
  },
  {
    path: "/signup",
    name: "signup",
    alias: "/register",
    component: () => import("../views/SignUpView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    meta: { needsAuthentication: true },
    component: () => import("../views/DashboardView.vue"),
  },
  {
    path: "/calendar",
    name: "calendar",
    meta: { needsAuthentication: true },
    component: () => import("../views/CalendarView.vue"),
  },
  {
    path: "/tasks/:id?",
    name: "tasks",
    alias: "/todo",
    meta: { needsAuthentication: true },
    component: () => import("../views/TasksView.vue"),
  },
  {
    path: "/flashcards",
    name: "flashcards",
    meta: { needsAuthentication: true },
    component: () => import("../views/FlashcardsView.vue"),
  },
  {
    path: "/projects",
    name: "projects",
    meta: { needsAuthentication: true },
    component: () => import("../views/ProjectsView.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    meta: { needsAuthentication: true },
    component: () => import("../views/SettingsView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.needsAuthentication && !store.state.isLoggedIn && hasValidRefreshToken()) {
    await store.dispatch("signIn").catch(e => logErrorAndAlert(e.message, "Could not sign in"));
  }
  if (!to.meta.needsAuthentication || store.state.isLoggedIn) {
    next();
  } else {
    next({ name: "signin" });
  }
});

export default router;
