import { createApp, h } from "vue";
import { createPinia } from "pinia";
import { RouterView } from "vue-router";
import "virtual:svg-icons-register";
import router from "./router";

import "element-plus/dist/index.css";
import "@/assets/main.css";

const app = createApp({ render: () => h(RouterView) });
app.use(createPinia());
app.use(router);
app.mount("#app");
