import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Kasir.vue';
import Sales from '../views/Sales.vue';
import Stock from '../views/Stock.vue';
import Supplier from '../views/Supplier.vue';
import Address from '../views/SelectAddress.vue';



const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/kasir', component: Products },
  { path: '/penjualan', component: Sales },
  { path: '/stok', component: Stock },
  { path: '/supplier', component: Supplier },
  { path: '/select-address', component: Address },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
