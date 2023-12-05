import { createRouter, createWebHistory } from "vue-router";
import Index from "./views/index.vue";

const routes = [
    { path: "/", component: Index, name: "index" },
];

const router = createRouter({
  // use replaceState of history
  history: createWebHistory(),
  routes,
});

// use router to

export default router;
