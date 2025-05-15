import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import "@fontsource/inter";
import '@/assets/css/hide-scrollbar.css';



createApp(App).use(router).mount('#app');
