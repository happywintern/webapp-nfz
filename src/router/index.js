import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Products from '../views/Kasir.vue';
import Sales from '../views/Sales.vue';
import Stock from '../views/Stock.vue';
import Supplier from '../views/Supplier.vue';
import Address from '../views/SelectAddress.vue';
import ViewProduct from '../views/crud-stok/EditProduk.vue';
import Staff from '../views/Staff.vue';

import ForgotPassword from '../views/ForgotPassword.vue';

const routes = [
  { path: '/', component: Login, name: 'Login' },
  { path: '/dashboard', component: Dashboard, name: 'Dashboard' },
  { path: '/kasir', component: Products, name: 'Kasir' },
  { path: '/penjualan', component: Sales, name: 'Penjualan' },
  { path: '/stok', component: Stock, name: 'Stock' },
  { path: '/supplier', component: Supplier, name: 'Supplier' },
  { path: '/select-address', component: Address, name: 'SelectAddress' },
  {
    path: '/view-product/:id',
    name: 'ViewProduct',
    component: ViewProduct,
    props: true // This allows the route params to be passed as props
  },
  { path: '/forgot-password', component: ForgotPassword, name: 'ForgotPassword' },
  {path: '/staff', component : Staff, name: 'Staff'},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
