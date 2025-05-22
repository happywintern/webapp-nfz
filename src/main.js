import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import "@fontsource/inter";
import '@/assets/css/hide-scrollbar.css';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.mount('#app');