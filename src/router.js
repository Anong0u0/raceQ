import { createRouter, createWebHistory } from "vue-router";
import Index from "./views/index.vue";
import History from "./views/history.vue";

const routes = [
  { path: "/", component: Index, name: "index" },
  { path: "/history", component: History, name: "history" },
];

const router = createRouter({
  // use replaceState of history
  history: createWebHistory(),
  routes,
});

// use router to

export default router;
