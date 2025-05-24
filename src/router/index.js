import { createRouter, createWebHistory } from 'vue-router';
import { checkRouteAccess } from './guards';
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
  { path: '/dashboard', component: Dashboard, name: 'Dashboard', meta: { requiresAuth: true } },
  { path: '/kasir', component: Products, name: 'Kasir', meta: { requiresAuth: true } },
  { path: '/penjualan', component: Sales, name: 'Penjualan', meta: { requiresAuth: true } },
  { path: '/stock', component: Stock, name: 'Stock', meta: { requiresAuth: true } },
  { path: '/supplier', component: Supplier, name: 'Supplier', meta: { requiresAuth: true } },
  { path: '/select-address', component: Address, name: 'SelectAddress', meta: { requiresAuth: true } },
  {
    path: '/view-product/:id',
    name: 'ViewProduct',
    component: ViewProduct,
    props: true,
    meta: { requiresAuth: true }
  },
  { path: '/forgot-password', component: ForgotPassword, name: 'ForgotPassword' },
  { path: '/staff', component: Staff, name: 'Staff', meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(checkRouteAccess);

export default router;
