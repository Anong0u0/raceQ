import { createApp } from "vue";
import "./style.css";
import { Quasar } from "quasar";
import router from "./router";

// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";

const app = createApp(App);

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});
app.use(router);
app.mount("#app");
