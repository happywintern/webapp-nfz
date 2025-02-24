import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
// import Products from '../views/Products.vue';
// import Sales from '../views/Sales.vue';
// import Orders from '../views/Orders.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  // { path: '/products', component: Products },
  // { path: '/sales', component: Sales },
  // { path: '/orders', component: Orders },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
