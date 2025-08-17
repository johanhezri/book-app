import "@/assets/main.css";
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css'
import router from "./router";
import { Tooltip } from "primevue";

const app = createApp(App);
app.provide("googleBookApi", "https://www.googleapis.com/books/v1");

app.use(router);
app.use(PrimeVue, { theme: { preset: Aura } });
app.directive("tooltip", Tooltip);

app.mount('#app')
