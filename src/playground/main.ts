import { createApp } from "vue";
import App from "./App.vue";
import NimbusUI from "../index";
import "../styles/index.css";

const app = createApp(App);
app.use(NimbusUI);
app.mount("#app");
