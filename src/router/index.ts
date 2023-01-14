import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Stage.vue"),
    },
    {
      path: "/area/drag",
      name: "areaDrag",
      component: () => import("../views/AreaDrag.vue"),
    },
  ],
});

export default router;
