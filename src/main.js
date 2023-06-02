import { createApp, h } from "vue";
import { createPinia } from "pinia";
import { RouterView } from "vue-router";
import "virtual:svg-icons-register";
import router from "./router";
import directive from "./directive";

import Icon from "@/components/Icon/index.vue";
import "element-plus/dist/index.css";
import "@/assets/main.css";

import "./permission";

const app = createApp({ render: () => h(RouterView) });
app.use(createPinia());
app.use(router);
app.use(directive, 123123);
app.component("Icon", Icon);
app.mount("#app");
