import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import "@fontsource/inter";



createApp(App).use(router).mount('#app');
