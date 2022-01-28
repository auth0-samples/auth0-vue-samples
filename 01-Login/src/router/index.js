import { createRouter as createVueRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import { createAuthGuard } from "@auth0/auth0-vue";

export function createRouter(app) {
  return createVueRouter({
    routes: [
      {
        path: "/",
        name: "home",
        component: Home
      },
      {
        path: "/profile",
        name: "profile",
        component: Profile,
        beforeEnter: createAuthGuard(app)
      }
    ],
    history: createWebHashHistory()
  })
}
