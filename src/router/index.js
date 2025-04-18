import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Kasir.vue';
import Sales from '../views/Sales.vue';
import Stock from '../views/Stock.vue';
import Supplier from '../views/Supplier.vue';
import Address from '../views/SelectAddress.vue';

const routes = [
  { path: '/', component: Login, name: 'Login' },
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/kasir', component: Products, name: 'Kasir' },
  { path: '/penjualan', component: Sales, name: 'Penjualan' },
  { path: '/stok', component: Stock, name: 'Stock' },
  { path: '/supplier', component: Supplier, name: 'Supplier' },
  { path: '/select-address', component: Address, name: 'SelectAddress' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
